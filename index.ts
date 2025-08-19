import type { GenericDataModel as GDM, TableNamesInDataModel as TN } from "convex/server";
import {
	type GenericId,
	type GenericValidator,
	type VAny,
	type VArray,
	type VBoolean,
	type VFloat64,
	type VId,
	type VInt64,
	type VLiteral,
	type VNull,
	type VObject,
	type VOptional,
	type VRecord,
	type VString,
	type VUnion,
	v,
} from "convex/values";
import type { IsEmptyObject, PartialOnUndefinedDeep, UnionToTuple, ValueOf, Writable } from "type-fest";
import type { IsUnion } from "type-fest/source/internal";
import * as z from "zod/v4/core";

// ZOD TYPES *******************************************************************************************************************************
export function zid<D extends GDM = GDM, T extends TN<D> = TN<D>>(tableName: T): ZodConvexID<D, T> {
	return new ZodConvexID({ tableName, type: "string" }) as ZodConvexID<D, T>;
}

// TRANSFORMERS ****************************************************************************************************************************
export const convexArgsFrom = <T extends ZArgs>(zod: T) => convexFrom(zod);

export const convexTableFrom = <T extends ZTable>(zod: T) => convexFrom(zod);

export const convexFrom = <T extends ZReturns>(zod: T) =>
	(zod instanceof z.$ZodType ? convexFromType(zod) : convexObjectFromShape(zod)) as ConvexFrom<T>;

// INTERNAL ********************************************************************************************************************************
const ZodConvexID: z.$constructor<ZodConvexID> = z.$constructor("ZodConvexID", (inst, def): void => {
	z.$ZodString.init(inst, def);
});

function convexObjectFromShape<S extends z.$ZodShape>(shape: S) {
	return v.object(Object.fromEntries(Object.entries(shape).map(([k, v]) => [k, convexFromType(v)]))) as unknown as ConvexObjectFromShape<S>;
}

function convexFromType<T extends z.$ZodType>(zod: T): ConvexFromType<T> {
	let convex: GenericValidator;

	if (zod instanceof ZodConvexID) convex = v.id(zod._zod.def.tableName);
	else if (zod instanceof z.$ZodAny || zod instanceof z.$ZodUnknown) convex = v.any();
	else if (zod instanceof z.$ZodArray) {
		const element = convexFromType(zod._zod.def.element);
		convex = v.array(element);
	} else if (zod instanceof z.$ZodBigInt) convex = v.int64();
	else if (zod instanceof z.$ZodBoolean) convex = v.boolean();
	else if (zod instanceof z.$ZodCatch) convex = convexFromType(zod._zod.def.innerType);
	else if (zod instanceof z.$ZodDefault || zod instanceof z.$ZodPrefault) {
		const inner = zod._zod.def.innerType;
		convex = convexFromType(inner instanceof z.$ZodOptional ? inner._zod.def.innerType : inner);
	} else if (zod instanceof z.$ZodEnum) convex = v.union(...Object.values(zod._zod.def.entries).map(v.literal));
	else if (zod instanceof z.$ZodLazy) convex = convexFromType(zod._zod.def.getter());
	else if (zod instanceof z.$ZodLiteral) {
		const [first, ...others] = zod._zod.def.values;
		if (!first) throw new Error("ZodLiteral must have at least one value");
		convex = others.length > 0 ? v.union(v.literal(first), ...others.map((val) => v.literal(val!))) : v.literal(first);
	} else if (zod instanceof z.$ZodNonOptional) {
		const inner = zod._zod.def.innerType;
		convex = convexFromType(inner instanceof z.$ZodOptional ? inner._zod.def.innerType : inner);
	} else if (zod instanceof z.$ZodNull) convex = v.null();
	else if (zod instanceof z.$ZodNullable) {
		const nullable = zod._zod.def.innerType;
		if (nullable instanceof z.$ZodOptional) convex = v.optional(v.union(convexFromType(nullable._zod.def.innerType), v.null()));
		convex = v.union(convexFromType(nullable), v.null());
	} else if (zod instanceof z.$ZodNumber || zod instanceof z.$ZodNaN) convex = v.float64();
	else if (zod instanceof z.$ZodObject)
		convex = v.object(Object.fromEntries(Object.entries(zod._zod.def.shape).map(([k, v]) => [k, convexFromType(v)])));
	else if (zod instanceof z.$ZodOptional) convex = v.optional(convexFromType(zod._zod.def.innerType));
	else if (zod instanceof z.$ZodPipe) convex = convexFromType(zod._zod.def.out);
	else if (zod instanceof z.$ZodRecord) {
		const keyType = convexFromType(zod._zod.def.keyType);
		function ensureStringOrId(v: GenericValidator) {
			if (v.kind === "union") v.members.map(ensureStringOrId);
			else if (v.kind !== "string" && v.kind !== "id") throw new Error(`Record keys must be strings or ids: ${v.kind}`);
		}
		ensureStringOrId(keyType);
		convex = v.record(keyType, convexFromType(zod._zod.def.valueType));
	} else if (zod instanceof z.$ZodReadonly) convex = convexFromType(zod._zod.def.innerType);
	else if (zod instanceof z.$ZodString || zod instanceof z.$ZodStringFormat || zod instanceof z.$ZodTemplateLiteral) convex = v.string();
	else if (zod instanceof z.$ZodTuple) {
		const allTypes = zod._zod.def.items.map(convexFromType);
		if (zod._zod.def.rest) allTypes.push(convexFromType(zod._zod.def.rest));
		convex = v.array(v.union(...allTypes));
	} else if (zod instanceof z.$ZodUnion) convex = v.union(...zod._zod.def.options.map(convexFromType));
	else throw new Error(`Unsupported Zod type "${zod._zod.def.type}" for conversion to Convex`);

	return convex as ConvexFromType<T>;
}

// TYPES ***********************************************************************************************************************************
export interface ZodConvexIDDef<D extends GDM = GDM, T extends TN<D> = TN<D>> extends z.$ZodStringDef {
	tableName: T;
}

export interface ZodConvexIDInternals<D extends GDM = GDM, T extends TN<D> = TN<D>> extends z.$ZodStringInternals<string> {
	def: ZodConvexIDDef<D, T>;
	output: GenericId<T>;
}

export interface ZodConvexID<D extends GDM = GDM, T extends TN<D> = TN<D>> extends z.$ZodType {
	_zod: ZodConvexIDInternals<D, T>;
}

export type ZArgs = z.$ZodType | z.$ZodObject | z.$ZodAny | z.$ZodUnknown | z.$ZodShape;
export type ZReturns = z.$ZodType | z.$ZodShape;
export type ZTable = z.$ZodObject | z.$ZodShape;

export type ConvexFrom<T extends z.$ZodType | z.$ZodShape> = T extends z.$ZodShape
	? ConvexObjectFromShape<T>
	: T extends z.$ZodType
		? ConvexFromType<T>
		: never;

export type ConvexFromEnum<E extends unknown[]> = E extends string[]
	? VUnion<E[number], { [Index in keyof E]: VLiteral<E[Index]> }>
	: never;

export type ConvexFromLiteral<L> = IsUnion<L> extends true ? ConvexFromLiterals<UnionToTuple<L>> : VLiteral<L>;
export type ConvexFromLiterals<L extends unknown[]> = VUnion<L[number], { [K in keyof L]: VLiteral<L[K]> }>;
export type ConvexFromNonOptional<T extends z.$ZodType> = T extends z.$ZodOptional<infer U extends z.$ZodType>
	? ConvexFromType<U>
	: ConvexFromType<T>;

export type ConvexFromNullable<T extends z.$ZodType> = T extends z.$ZodOptional<infer U extends z.$ZodType>
	? VOptional<VUnion<null | z.infer<U>, [ConvexFromType<U>, VNull]>>
	: VUnion<null | z.infer<T>, [ConvexFromType<T>, VNull]>;

export type ConvexFromRecord<K extends z.$ZodRecordKey, V extends z.$ZodType> = K extends z.$ZodString | z.$ZodSymbol
	? VRecord<Record<ConvexFromType<K>["type"], ConvexFromType<V>["type"]>, ConvexFromType<K>, ConvexFromType<V>>
	: never;

export type ConvexFromUnionContent<T extends z.$ZodType[]> = VUnion<
	ConvexFromType<T[number]>["type"],
	{
		[Index in keyof T]: T[Index] extends z.$ZodType ? ConvexFromType<T[Index]> : never;
	},
	"required",
	ConvexFromType<T[number]>["fieldPaths"]
>;

export type ZSimpleType =
	| z.$ZodTemplateLiteral
	| z.$ZodNaN
	| z.$ZodString
	| z.$ZodNumber
	| z.$ZodBoolean
	| z.$ZodBigInt
	| z.$ZodNull
	| z.$ZodAny
	| z.$ZodUnknown;

export type ConvexFromSimpleType<Z extends ZSimpleType> = Z extends ZodConvexID<infer _D, infer T>
	? VId<T>
	: Z extends z.$ZodAny | z.$ZodUnknown
		? VAny
		: Z extends z.$ZodBoolean
			? VBoolean
			: Z extends z.$ZodBigInt
				? VInt64
				: Z extends z.$ZodNull
					? VNull
					: Z extends z.$ZodNumber | z.$ZodNaN
						? VFloat64
						: Z extends z.$ZodString | z.$ZodTemplateLiteral
							? VString
							: never;

export type ConvexFromType<Z extends z.$ZodType> = Z extends ZSimpleType
	? ConvexFromSimpleType<Z>
	: Z extends z.$ZodLiteral<infer L>
		? IsUnion<L> extends true
			? ConvexFromLiterals<UnionToTuple<L>>
			: VLiteral<L>
		: Z extends z.$ZodCatch<infer T extends z.$ZodType>
			? ConvexFromType<T>
			: Z extends z.$ZodLazy<infer T extends z.$ZodType>
				? ConvexFromType<T>
				: Z extends z.$ZodNonOptional<infer T extends z.$ZodType>
					? ConvexFromNonOptional<T>
					: Z extends z.$ZodNullable<infer T extends z.$ZodType>
						? ConvexFromNullable<T>
						: Z extends z.$ZodPrefault<infer T extends z.$ZodType>
							? ConvexFromNonOptional<T>
							: Z extends z.$ZodReadonly<infer T extends z.$ZodType>
								? ConvexFromType<T>
								: Z extends z.$ZodOptional<infer T extends z.$ZodType>
									? VOptional<ConvexFromType<T>>
									: Z extends z.$ZodDefault<infer T extends z.$ZodType>
										? ConvexFromNonOptional<T>
										: Z extends z.$ZodEnum<infer E>
											? ConvexFromEnum<UnionToTuple<ValueOf<E>>>
											: Z extends z.$ZodArray<infer E extends z.$ZodType>
												? VArray<ConvexFromType<E>["type"][], ConvexFromType<E>>
												: Z extends z.$ZodPipe<infer _I, infer O extends z.$ZodType>
													? ConvexFromType<O>
													: Z extends z.$ZodTuple<infer E extends z.$ZodType[]>
														? VArray<ConvexFromType<E[number]>["type"][], ConvexFromUnionContent<E>>
														: Z extends z.$ZodObject<infer S>
															? ConvexObjectFromShape<S>
															: Z extends z.$ZodUnion<infer T extends Array<z.$ZodType> | ReadonlyArray<z.$ZodType>>
																? ConvexFromUnionContent<Writable<T>>
																: Z extends z.$ZodRecord<infer K extends z.$ZodRecordKey, infer V extends z.$ZodType>
																	? ConvexFromRecord<K, V>
																	: never;

export type ConvexObjectFromShape<S extends z.$ZodShape> = VObject<
	PartialOnUndefinedDeep<{ [K in keyof S]: z.infer<S[K]> }>,
	{ [K in keyof S]: ConvexFromType<S[K]> },
	"required",
	IsEmptyObject<S> extends true
		? never
		: { [K in keyof S]: JoinFieldPaths<K & string, ConvexFromType<S[K]>["fieldPaths"]> | K }[keyof S] & string
>;

export type JoinFieldPaths<S extends string, E extends string> = `${S}.${E}`;
