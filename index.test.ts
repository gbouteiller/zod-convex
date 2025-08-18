import {
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
import type { EmptyObject } from "type-fest";
import { expect, expectTypeOf, test } from "vitest";
import * as z from "zod";
import { convexFrom, zid } from ".";

// CONVEX FROM *****************************************************************************************************************************
test("any", () => {
	const expected = v.any();
	expectTypeOf(convexFrom(z.any())).toEqualTypeOf<VAny>();
	expect(convexFrom(z.any())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.unknown())).toEqualTypeOf<VAny>();
	expect(convexFrom(z.unknown())).toStrictEqual(expected);
});

test("boolean", () => {
	expectTypeOf(convexFrom(z.boolean())).toEqualTypeOf<VBoolean>();
	expect(convexFrom(z.boolean())).toStrictEqual(v.boolean());
	expectTypeOf(convexFrom(z.stringbool())).toEqualTypeOf<VBoolean>();
	expect(convexFrom(z.stringbool())).toStrictEqual(v.boolean());
});

test("float64", () => {
	const expected = v.float64();
	expectTypeOf(convexFrom(z.float32())).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.float32())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.float64())).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.float64())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.int())).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.int())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.int32())).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.int32())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.nan())).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.nan())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.number())).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.number())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.uint32())).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.uint32())).toStrictEqual(expected);
});

test("id", () => {
	expectTypeOf(convexFrom(zid("users"))).toEqualTypeOf<VId<"users">>();
	expect(convexFrom(zid("users"))).toStrictEqual(v.id("users"));
});

test("int64", () => {
	const expected = v.int64();
	expectTypeOf(convexFrom(z.bigint())).toEqualTypeOf<VInt64>();
	expect(convexFrom(z.bigint())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.int64())).toEqualTypeOf<VInt64>();
	expect(convexFrom(z.int64())).toStrictEqual(expected);
	expectTypeOf(convexFrom(z.uint64())).toEqualTypeOf<VInt64>();
	expect(convexFrom(z.uint64())).toStrictEqual(expected);
});

test("literal", () => {
	expectTypeOf(convexFrom(z.literal("a"))).toEqualTypeOf<VLiteral<"a">>();
	expect(convexFrom(z.literal("a"))).toStrictEqual(v.literal("a"));
	expectTypeOf(convexFrom(z.literal(["a", "b"]))).toEqualTypeOf<VUnion<"a" | "b", [VLiteral<"a">, VLiteral<"b">]>>();
	expect(convexFrom(z.literal(["a", "b"]))).toStrictEqual(v.union(v.literal("a"), v.literal("b")));
});

test("null", () => {
	// null
	expectTypeOf(convexFrom(z.null())).toEqualTypeOf<VNull>();
	expect(convexFrom(z.null())).toStrictEqual(v.null());
});

test("string", () => {
	const expected = v.string();
	// base64
	expectTypeOf(convexFrom(z.base64())).toEqualTypeOf<VString>();
	expect(convexFrom(z.base64())).toStrictEqual(expected);
	// base64url
	expectTypeOf(convexFrom(z.base64url())).toEqualTypeOf<VString>();
	expect(convexFrom(z.base64url())).toStrictEqual(expected);
	// cidrv4
	expectTypeOf(convexFrom(z.cidrv4())).toEqualTypeOf<VString>();
	expect(convexFrom(z.cidrv4())).toStrictEqual(expected);
	// cidrv6
	expectTypeOf(convexFrom(z.cidrv6())).toEqualTypeOf<VString>();
	expect(convexFrom(z.cidrv6())).toStrictEqual(expected);
	// cuid
	expectTypeOf(convexFrom(z.cuid())).toEqualTypeOf<VString>();
	expect(convexFrom(z.cuid())).toStrictEqual(expected);
	// cuid2
	expectTypeOf(convexFrom(z.cuid2())).toEqualTypeOf<VString>();
	expect(convexFrom(z.cuid2())).toStrictEqual(expected);
	// e164
	expectTypeOf(convexFrom(z.e164())).toEqualTypeOf<VString>();
	expect(convexFrom(z.e164())).toStrictEqual(expected);
	// email
	expectTypeOf(convexFrom(z.email())).toEqualTypeOf<VString>();
	expect(convexFrom(z.email())).toStrictEqual(expected);
	// emoji
	expectTypeOf(convexFrom(z.emoji())).toEqualTypeOf<VString>();
	expect(convexFrom(z.emoji())).toStrictEqual(expected);
	// guid
	expectTypeOf(convexFrom(z.guid())).toEqualTypeOf<VString>();
	expect(convexFrom(z.guid())).toStrictEqual(expected);
	// ipv4
	expectTypeOf(convexFrom(z.ipv4())).toEqualTypeOf<VString>();
	expect(convexFrom(z.ipv4())).toStrictEqual(expected);
	// ipv6
	expectTypeOf(convexFrom(z.ipv6())).toEqualTypeOf<VString>();
	expect(convexFrom(z.ipv6())).toStrictEqual(expected);
	// iso.date
	expectTypeOf(convexFrom(z.iso.date())).toEqualTypeOf<VString>();
	expect(convexFrom(z.iso.date())).toStrictEqual(expected);
	// iso.datetime
	expectTypeOf(convexFrom(z.iso.datetime())).toEqualTypeOf<VString>();
	expect(convexFrom(z.iso.datetime())).toStrictEqual(expected);
	// iso.duration
	expectTypeOf(convexFrom(z.iso.duration())).toEqualTypeOf<VString>();
	expect(convexFrom(z.iso.duration())).toStrictEqual(expected);
	// iso.time
	expectTypeOf(convexFrom(z.iso.time())).toEqualTypeOf<VString>();
	expect(convexFrom(z.iso.time())).toStrictEqual(expected);
	// jwt
	expectTypeOf(convexFrom(z.jwt())).toEqualTypeOf<VString>();
	expect(convexFrom(z.jwt())).toStrictEqual(expected);
	// ksuid
	expectTypeOf(convexFrom(z.ksuid())).toEqualTypeOf<VString>();
	expect(convexFrom(z.ksuid())).toStrictEqual(expected);
	// nanoid
	expectTypeOf(convexFrom(z.nanoid())).toEqualTypeOf<VString>();
	expect(convexFrom(z.nanoid())).toStrictEqual(expected);
	// string
	expectTypeOf(convexFrom(z.string())).toEqualTypeOf<VString>();
	expect(convexFrom(z.string())).toStrictEqual(expected);
	// stringFormat
	expectTypeOf(convexFrom(z.stringFormat("ok", () => "ok"))).toEqualTypeOf<VString>();
	expect(convexFrom(z.stringFormat("ok", () => "ok"))).toStrictEqual(expected);
	// templateLiteral
	expectTypeOf(convexFrom(z.templateLiteral(["hello, ", z.string()]))).toEqualTypeOf<VString>();
	expect(convexFrom(z.templateLiteral(["hello, ", z.string()]))).toStrictEqual(expected);
	// ulid
	expectTypeOf(convexFrom(z.ulid())).toEqualTypeOf<VString>();
	expect(convexFrom(z.ulid())).toStrictEqual(expected);
	// url
	expectTypeOf(convexFrom(z.url())).toEqualTypeOf<VString>();
	expect(convexFrom(z.url())).toStrictEqual(expected);
	// uuid
	expectTypeOf(convexFrom(z.uuid())).toEqualTypeOf<VString>();
	expect(convexFrom(z.uuid())).toStrictEqual(expected);
	// uuidv4
	expectTypeOf(convexFrom(z.uuidv4())).toEqualTypeOf<VString>();
	expect(convexFrom(z.uuidv4())).toStrictEqual(expected);
	// uuidv6
	expectTypeOf(convexFrom(z.uuidv6())).toEqualTypeOf<VString>();
	expect(convexFrom(z.uuidv6())).toStrictEqual(expected);
	// uuidv7
	expectTypeOf(convexFrom(z.uuidv7())).toEqualTypeOf<VString>();
	expect(convexFrom(z.uuidv7())).toStrictEqual(expected);
	// xid
	expectTypeOf(convexFrom(z.xid())).toEqualTypeOf<VString>();
	expect(convexFrom(z.xid())).toStrictEqual(expected);
});

test("object", () => {
	// looseObject
	expectTypeOf(convexFrom(z.looseObject({}))).toExtend<VObject<EmptyObject, EmptyObject>>();
	expect(convexFrom(z.looseObject({}))).toStrictEqual(v.object({}));
	// object
	expectTypeOf(convexFrom(z.object({}))).toExtend<VObject<EmptyObject, EmptyObject>>();
	expect(convexFrom(z.object({}))).toStrictEqual(v.object({}));
	// strictObject
	expectTypeOf(convexFrom(z.strictObject({}))).toExtend<VObject<EmptyObject, EmptyObject>>();
	expect(convexFrom(z.strictObject({}))).toStrictEqual(v.object({}));
});

test("record", () => {
	// partialRecord
	// expect(convexFrom(z.partialRecord(z.string(), z.number()))).toStrictEqual(v.record(v.string(), v.float64()));
	// record
	expectTypeOf(convexFrom(z.record(z.string(), z.number()))).toEqualTypeOf<VRecord<Record<string, number>, VString, VFloat64>>();
	expect(convexFrom(z.record(z.string(), z.number()))).toStrictEqual(v.record(v.string(), v.float64()));
});

test("union", () => {
	// discriminatedUnion
	expectTypeOf(
		convexFrom(z.discriminatedUnion("status", [z.object({ status: z.literal("ok") }), z.object({ status: z.literal("error") })])),
	).toExtend<
		VUnion<
			{ status: "ok" } | { status: "error" },
			[VObject<{ status: "ok" }, { status: VLiteral<"ok"> }>, VObject<{ status: "error" }, { status: VLiteral<"error"> }>]
		>
	>();
	expect(
		convexFrom(z.discriminatedUnion("status", [z.object({ status: z.literal("ok") }), z.object({ status: z.literal("error") })])),
	).toStrictEqual(v.union(v.object({ status: v.literal("ok") }), v.object({ status: v.literal("error") })));
	// union
	expectTypeOf(convexFrom(z.union([z.string(), z.number()]))).toEqualTypeOf<VUnion<string | number, [VString, VFloat64]>>();
	expect(convexFrom(z.union([z.string(), z.number()]))).toStrictEqual(v.union(v.string(), v.number()));
});

test("coercion", () => {
	// coerce
	expectTypeOf(convexFrom(z.coerce.string())).toEqualTypeOf<VString>();
	expect(convexFrom(z.coerce.string())).toStrictEqual(v.string());
});

test("wrappers", () => {
	// array
	expectTypeOf(convexFrom(z.coerce.string().array())).toEqualTypeOf<VArray<string[], VString>>();
	expect(convexFrom(z.string().array())).toStrictEqual(v.array(v.string()));
	// catch
	expectTypeOf(convexFrom(z.number().catch(1))).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.number().catch(1))).toStrictEqual(v.float64());
	// default
	expectTypeOf(convexFrom(z.boolean().optional().default(false))).toEqualTypeOf<VBoolean>();
	expect(convexFrom(z.boolean().optional().default(false))).toStrictEqual(v.boolean());
	// lazy
	expectTypeOf(convexFrom(z.lazy(() => z.boolean()))).toEqualTypeOf<VBoolean>();
	expect(convexFrom(z.lazy(() => z.boolean()))).toStrictEqual(v.boolean());
	// nonoptional
	expectTypeOf(convexFrom(z.nonoptional(z.nullish(z.boolean())))).toEqualTypeOf<VUnion<boolean | null, [VBoolean, VNull]>>();
	expect(convexFrom(z.nonoptional(z.nullish(z.boolean())))).toStrictEqual(v.union(v.boolean(), v.null()));
	// nullable
	expectTypeOf(convexFrom(z.nullable(z.string()))).toEqualTypeOf<VUnion<string | null, [VString, VNull]>>();
	expect(convexFrom(z.nullable(z.string()))).toStrictEqual(v.union(v.string(), v.null()));
	// nullish
	expectTypeOf(convexFrom(z.nullish(z.string()))).toEqualTypeOf<VOptional<VUnion<string | null, [VString, VNull]>>>();
	expect(convexFrom(z.nullish(z.string()))).toStrictEqual(v.optional(v.union(v.string(), v.null())));
	// optional
	expectTypeOf(convexFrom(z.optional(z.nonoptional(z.nullish(z.boolean()))))).toEqualTypeOf<
		VOptional<VUnion<boolean | null, [VBoolean, VNull]>>
	>();
	expect(convexFrom(z.optional(z.nonoptional(z.nullish(z.boolean()))))).toStrictEqual(v.optional(v.union(v.boolean(), v.null())));
	// prefault
	expectTypeOf(convexFrom(z.boolean().optional().prefault(false))).toEqualTypeOf<VBoolean>();
	expect(convexFrom(z.boolean().optional().prefault(false))).toStrictEqual(v.boolean());
	// preprocess
	expectTypeOf(convexFrom(z.preprocess((v) => (typeof v === "string" ? Number.parseInt(v, 10) : v), z.int()))).toEqualTypeOf<VFloat64>();
	expect(convexFrom(z.preprocess((v) => (typeof v === "string" ? Number.parseInt(v, 10) : v), z.int()))).toStrictEqual(v.float64());
	// pipe
	expectTypeOf(convexFrom(z.pipe(z.string(), z.stringbool()))).toEqualTypeOf<VBoolean>();
	expect(convexFrom(z.pipe(z.string(), z.stringbool()))).toStrictEqual(v.boolean());
	// readonly
	expectTypeOf(convexFrom(z.readonly(z.string()))).toEqualTypeOf<VString>();
	expect(convexFrom(z.readonly(z.string()))).toStrictEqual(v.string());
});

test("utilities", () => {
	// clone
	expectTypeOf(convexFrom(z.boolean().clone())).toEqualTypeOf<VBoolean>();
	expect(convexFrom(z.boolean().clone())).toStrictEqual(v.boolean());
});

test("z.keyof", () => {
	expectTypeOf(convexFrom(z.keyof(z.object({ a: z.string() })))).toEqualTypeOf<VUnion<"a", [VLiteral<"a">]>>();
	expect(convexFrom(z.keyof(z.object({ a: z.string() })))).toStrictEqual(v.union(v.literal("a")));
	expectTypeOf(convexFrom(z.keyof(z.object({ a: z.string(), b: z.boolean() })))).toEqualTypeOf<
		VUnion<"a" | "b", [VLiteral<"a">, VLiteral<"b">]>
	>();
	expect(convexFrom(z.keyof(z.object({ a: z.string(), b: z.boolean() })))).toStrictEqual(v.union(v.literal("a"), v.literal("b")));
});

test("z.tuple", () => {
	expectTypeOf(convexFrom(z.tuple([z.string(), z.number()]))).toEqualTypeOf<
		VArray<(string | number)[], VUnion<string | number, [VString, VFloat64]>>
	>();
	expect(convexFrom(z.tuple([z.string(), z.number()]))).toStrictEqual(v.array(v.union(v.string(), v.float64())));
});

test("unsupported types", () => {
	expect(() => convexFrom(z.custom())).toThrow('Unsupported Zod type "custom" for conversion to Convex');
	expect(() => convexFrom(z.date())).toThrow('Unsupported Zod type "date" for conversion to Convex');
	expect(() => convexFrom(z.file())).toThrow('Unsupported Zod type "file" for conversion to Convex');
	expect(() => convexFrom(z.intersection(z.string(), z.number()))).toThrow('Unsupported Zod type "intersection" for conversion to Convex');
	expect(() => convexFrom(z.map(z.string(), z.number()))).toThrow('Unsupported Zod type "map" for conversion to Convex');
	expect(() => convexFrom(z.never())).toThrow('Unsupported Zod type "never" for conversion to Convex');
	expect(() => convexFrom(z.promise(z.boolean()))).toThrow('Unsupported Zod type "promise" for conversion to Convex');
	expect(() => convexFrom(z.set(z.string()))).toThrow('Unsupported Zod type "set" for conversion to Convex');
	expect(() => convexFrom(z.transform((s) => `${s}`))).toThrow('Unsupported Zod type "transform" for conversion to Convex');
	expect(() => convexFrom(z.undefined())).toThrow('Unsupported Zod type "undefined" for conversion to Convex');
	expect(() => convexFrom(z.void())).toThrow('Unsupported Zod type "void" for conversion to Convex');
	// expect(() => convexFrom(z.json())).toThrow('Maximum call stack size exceeded');
});
