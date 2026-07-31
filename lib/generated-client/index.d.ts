
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model StudentProfile
 * 
 */
export type StudentProfile = $Result.DefaultSelection<Prisma.$StudentProfilePayload>
/**
 * Model AgentProfile
 * 
 */
export type AgentProfile = $Result.DefaultSelection<Prisma.$AgentProfilePayload>
/**
 * Model Property
 * 
 */
export type Property = $Result.DefaultSelection<Prisma.$PropertyPayload>
/**
 * Model Inquiry
 * 
 */
export type Inquiry = $Result.DefaultSelection<Prisma.$InquiryPayload>
/**
 * Model Viewing
 * 
 */
export type Viewing = $Result.DefaultSelection<Prisma.$ViewingPayload>
/**
 * Model ChatRoom
 * 
 */
export type ChatRoom = $Result.DefaultSelection<Prisma.$ChatRoomPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model OTP
 * 
 */
export type OTP = $Result.DefaultSelection<Prisma.$OTPPayload>
/**
 * Model Report
 * 
 */
export type Report = $Result.DefaultSelection<Prisma.$ReportPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  STUDENT: 'STUDENT',
  AGENT: 'AGENT',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const OTPPurpose: {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET'
};

export type OTPPurpose = (typeof OTPPurpose)[keyof typeof OTPPurpose]


export const ReportReason: {
  FRAUD_SCAM: 'FRAUD_SCAM',
  INACCURATE_DETAILS: 'INACCURATE_DETAILS',
  INAPPROPRIATE_CONTENT: 'INAPPROPRIATE_CONTENT',
  SPAM: 'SPAM',
  OTHER: 'OTHER'
};

export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason]


export const ReportStatus: {
  PENDING: 'PENDING',
  INVESTIGATING: 'INVESTIGATING',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED'
};

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type OTPPurpose = $Enums.OTPPurpose

export const OTPPurpose: typeof $Enums.OTPPurpose

export type ReportReason = $Enums.ReportReason

export const ReportReason: typeof $Enums.ReportReason

export type ReportStatus = $Enums.ReportStatus

export const ReportStatus: typeof $Enums.ReportStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.studentProfile`: Exposes CRUD operations for the **StudentProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentProfiles
    * const studentProfiles = await prisma.studentProfile.findMany()
    * ```
    */
  get studentProfile(): Prisma.StudentProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentProfile`: Exposes CRUD operations for the **AgentProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentProfiles
    * const agentProfiles = await prisma.agentProfile.findMany()
    * ```
    */
  get agentProfile(): Prisma.AgentProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.property`: Exposes CRUD operations for the **Property** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Properties
    * const properties = await prisma.property.findMany()
    * ```
    */
  get property(): Prisma.PropertyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inquiry`: Exposes CRUD operations for the **Inquiry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inquiries
    * const inquiries = await prisma.inquiry.findMany()
    * ```
    */
  get inquiry(): Prisma.InquiryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.viewing`: Exposes CRUD operations for the **Viewing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Viewings
    * const viewings = await prisma.viewing.findMany()
    * ```
    */
  get viewing(): Prisma.ViewingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatRoom`: Exposes CRUD operations for the **ChatRoom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatRooms
    * const chatRooms = await prisma.chatRoom.findMany()
    * ```
    */
  get chatRoom(): Prisma.ChatRoomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oTP`: Exposes CRUD operations for the **OTP** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OTPS
    * const oTPS = await prisma.oTP.findMany()
    * ```
    */
  get oTP(): Prisma.OTPDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.report`: Exposes CRUD operations for the **Report** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.report.findMany()
    * ```
    */
  get report(): Prisma.ReportDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    StudentProfile: 'StudentProfile',
    AgentProfile: 'AgentProfile',
    Property: 'Property',
    Inquiry: 'Inquiry',
    Viewing: 'Viewing',
    ChatRoom: 'ChatRoom',
    Message: 'Message',
    OTP: 'OTP',
    Report: 'Report'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "studentProfile" | "agentProfile" | "property" | "inquiry" | "viewing" | "chatRoom" | "message" | "oTP" | "report"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      StudentProfile: {
        payload: Prisma.$StudentProfilePayload<ExtArgs>
        fields: Prisma.StudentProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          findFirst: {
            args: Prisma.StudentProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          findMany: {
            args: Prisma.StudentProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>[]
          }
          create: {
            args: Prisma.StudentProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          createMany: {
            args: Prisma.StudentProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>[]
          }
          delete: {
            args: Prisma.StudentProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          update: {
            args: Prisma.StudentProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          deleteMany: {
            args: Prisma.StudentProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>[]
          }
          upsert: {
            args: Prisma.StudentProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          aggregate: {
            args: Prisma.StudentProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentProfile>
          }
          groupBy: {
            args: Prisma.StudentProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentProfileCountArgs<ExtArgs>
            result: $Utils.Optional<StudentProfileCountAggregateOutputType> | number
          }
        }
      }
      AgentProfile: {
        payload: Prisma.$AgentProfilePayload<ExtArgs>
        fields: Prisma.AgentProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>
          }
          findFirst: {
            args: Prisma.AgentProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>
          }
          findMany: {
            args: Prisma.AgentProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>[]
          }
          create: {
            args: Prisma.AgentProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>
          }
          createMany: {
            args: Prisma.AgentProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>[]
          }
          delete: {
            args: Prisma.AgentProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>
          }
          update: {
            args: Prisma.AgentProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>
          }
          deleteMany: {
            args: Prisma.AgentProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>[]
          }
          upsert: {
            args: Prisma.AgentProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentProfilePayload>
          }
          aggregate: {
            args: Prisma.AgentProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentProfile>
          }
          groupBy: {
            args: Prisma.AgentProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentProfileCountArgs<ExtArgs>
            result: $Utils.Optional<AgentProfileCountAggregateOutputType> | number
          }
        }
      }
      Property: {
        payload: Prisma.$PropertyPayload<ExtArgs>
        fields: Prisma.PropertyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findFirst: {
            args: Prisma.PropertyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findMany: {
            args: Prisma.PropertyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          create: {
            args: Prisma.PropertyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          createMany: {
            args: Prisma.PropertyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          delete: {
            args: Prisma.PropertyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          update: {
            args: Prisma.PropertyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          deleteMany: {
            args: Prisma.PropertyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          upsert: {
            args: Prisma.PropertyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          aggregate: {
            args: Prisma.PropertyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProperty>
          }
          groupBy: {
            args: Prisma.PropertyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyCountAggregateOutputType> | number
          }
        }
      }
      Inquiry: {
        payload: Prisma.$InquiryPayload<ExtArgs>
        fields: Prisma.InquiryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InquiryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InquiryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          findFirst: {
            args: Prisma.InquiryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InquiryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          findMany: {
            args: Prisma.InquiryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>[]
          }
          create: {
            args: Prisma.InquiryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          createMany: {
            args: Prisma.InquiryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InquiryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>[]
          }
          delete: {
            args: Prisma.InquiryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          update: {
            args: Prisma.InquiryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          deleteMany: {
            args: Prisma.InquiryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InquiryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InquiryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>[]
          }
          upsert: {
            args: Prisma.InquiryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          aggregate: {
            args: Prisma.InquiryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInquiry>
          }
          groupBy: {
            args: Prisma.InquiryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InquiryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InquiryCountArgs<ExtArgs>
            result: $Utils.Optional<InquiryCountAggregateOutputType> | number
          }
        }
      }
      Viewing: {
        payload: Prisma.$ViewingPayload<ExtArgs>
        fields: Prisma.ViewingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ViewingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ViewingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>
          }
          findFirst: {
            args: Prisma.ViewingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ViewingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>
          }
          findMany: {
            args: Prisma.ViewingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>[]
          }
          create: {
            args: Prisma.ViewingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>
          }
          createMany: {
            args: Prisma.ViewingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ViewingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>[]
          }
          delete: {
            args: Prisma.ViewingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>
          }
          update: {
            args: Prisma.ViewingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>
          }
          deleteMany: {
            args: Prisma.ViewingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ViewingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ViewingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>[]
          }
          upsert: {
            args: Prisma.ViewingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViewingPayload>
          }
          aggregate: {
            args: Prisma.ViewingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateViewing>
          }
          groupBy: {
            args: Prisma.ViewingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ViewingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ViewingCountArgs<ExtArgs>
            result: $Utils.Optional<ViewingCountAggregateOutputType> | number
          }
        }
      }
      ChatRoom: {
        payload: Prisma.$ChatRoomPayload<ExtArgs>
        fields: Prisma.ChatRoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatRoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatRoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>
          }
          findFirst: {
            args: Prisma.ChatRoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatRoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>
          }
          findMany: {
            args: Prisma.ChatRoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>[]
          }
          create: {
            args: Prisma.ChatRoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>
          }
          createMany: {
            args: Prisma.ChatRoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatRoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>[]
          }
          delete: {
            args: Prisma.ChatRoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>
          }
          update: {
            args: Prisma.ChatRoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>
          }
          deleteMany: {
            args: Prisma.ChatRoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatRoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatRoomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>[]
          }
          upsert: {
            args: Prisma.ChatRoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatRoomPayload>
          }
          aggregate: {
            args: Prisma.ChatRoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatRoom>
          }
          groupBy: {
            args: Prisma.ChatRoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatRoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatRoomCountArgs<ExtArgs>
            result: $Utils.Optional<ChatRoomCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      OTP: {
        payload: Prisma.$OTPPayload<ExtArgs>
        fields: Prisma.OTPFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OTPFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OTPFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>
          }
          findFirst: {
            args: Prisma.OTPFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OTPFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>
          }
          findMany: {
            args: Prisma.OTPFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>[]
          }
          create: {
            args: Prisma.OTPCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>
          }
          createMany: {
            args: Prisma.OTPCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OTPCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>[]
          }
          delete: {
            args: Prisma.OTPDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>
          }
          update: {
            args: Prisma.OTPUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>
          }
          deleteMany: {
            args: Prisma.OTPDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OTPUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OTPUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>[]
          }
          upsert: {
            args: Prisma.OTPUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPPayload>
          }
          aggregate: {
            args: Prisma.OTPAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOTP>
          }
          groupBy: {
            args: Prisma.OTPGroupByArgs<ExtArgs>
            result: $Utils.Optional<OTPGroupByOutputType>[]
          }
          count: {
            args: Prisma.OTPCountArgs<ExtArgs>
            result: $Utils.Optional<OTPCountAggregateOutputType> | number
          }
        }
      }
      Report: {
        payload: Prisma.$ReportPayload<ExtArgs>
        fields: Prisma.ReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findFirst: {
            args: Prisma.ReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findMany: {
            args: Prisma.ReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          create: {
            args: Prisma.ReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          createMany: {
            args: Prisma.ReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          delete: {
            args: Prisma.ReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          update: {
            args: Prisma.ReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          deleteMany: {
            args: Prisma.ReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          upsert: {
            args: Prisma.ReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          aggregate: {
            args: Prisma.ReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReport>
          }
          groupBy: {
            args: Prisma.ReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportCountArgs<ExtArgs>
            result: $Utils.Optional<ReportCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    studentProfile?: StudentProfileOmit
    agentProfile?: AgentProfileOmit
    property?: PropertyOmit
    inquiry?: InquiryOmit
    viewing?: ViewingOmit
    chatRoom?: ChatRoomOmit
    message?: MessageOmit
    oTP?: OTPOmit
    report?: ReportOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    inquiries: number
    receivedInquiries: number
    viewings: number
    studentChatRooms: number
    agentChatRooms: number
    messagesSent: number
    reportsSubmitted: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inquiries?: boolean | UserCountOutputTypeCountInquiriesArgs
    receivedInquiries?: boolean | UserCountOutputTypeCountReceivedInquiriesArgs
    viewings?: boolean | UserCountOutputTypeCountViewingsArgs
    studentChatRooms?: boolean | UserCountOutputTypeCountStudentChatRoomsArgs
    agentChatRooms?: boolean | UserCountOutputTypeCountAgentChatRoomsArgs
    messagesSent?: boolean | UserCountOutputTypeCountMessagesSentArgs
    reportsSubmitted?: boolean | UserCountOutputTypeCountReportsSubmittedArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInquiriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedInquiriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountViewingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ViewingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStudentChatRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatRoomWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAgentChatRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatRoomWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessagesSentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReportsSubmittedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
  }


  /**
   * Count Type StudentProfileCountOutputType
   */

  export type StudentProfileCountOutputType = {
    properties: number
    reports: number
  }

  export type StudentProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    properties?: boolean | StudentProfileCountOutputTypeCountPropertiesArgs
    reports?: boolean | StudentProfileCountOutputTypeCountReportsArgs
  }

  // Custom InputTypes
  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfileCountOutputType
     */
    select?: StudentProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountPropertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
  }


  /**
   * Count Type AgentProfileCountOutputType
   */

  export type AgentProfileCountOutputType = {
    properties: number
  }

  export type AgentProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    properties?: boolean | AgentProfileCountOutputTypeCountPropertiesArgs
  }

  // Custom InputTypes
  /**
   * AgentProfileCountOutputType without action
   */
  export type AgentProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfileCountOutputType
     */
    select?: AgentProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgentProfileCountOutputType without action
   */
  export type AgentProfileCountOutputTypeCountPropertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
  }


  /**
   * Count Type PropertyCountOutputType
   */

  export type PropertyCountOutputType = {
    inquiries: number
    viewings: number
    chatRooms: number
    reports: number
  }

  export type PropertyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inquiries?: boolean | PropertyCountOutputTypeCountInquiriesArgs
    viewings?: boolean | PropertyCountOutputTypeCountViewingsArgs
    chatRooms?: boolean | PropertyCountOutputTypeCountChatRoomsArgs
    reports?: boolean | PropertyCountOutputTypeCountReportsArgs
  }

  // Custom InputTypes
  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyCountOutputType
     */
    select?: PropertyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountInquiriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiryWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountViewingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ViewingWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountChatRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatRoomWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
  }


  /**
   * Count Type ChatRoomCountOutputType
   */

  export type ChatRoomCountOutputType = {
    messages: number
  }

  export type ChatRoomCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatRoomCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ChatRoomCountOutputType without action
   */
  export type ChatRoomCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoomCountOutputType
     */
    select?: ChatRoomCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatRoomCountOutputType without action
   */
  export type ChatRoomCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    password: string | null
    role: $Enums.Role | null
    isEmailVerified: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    password: string | null
    role: $Enums.Role | null
    isEmailVerified: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    phone: number
    password: number
    role: number
    isEmailVerified: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    isEmailVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    isEmailVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    isEmailVerified?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    phone: string
    password: string
    role: $Enums.Role
    isEmailVerified: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    isEmailVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    studentProfile?: boolean | User$studentProfileArgs<ExtArgs>
    agentProfile?: boolean | User$agentProfileArgs<ExtArgs>
    inquiries?: boolean | User$inquiriesArgs<ExtArgs>
    receivedInquiries?: boolean | User$receivedInquiriesArgs<ExtArgs>
    viewings?: boolean | User$viewingsArgs<ExtArgs>
    studentChatRooms?: boolean | User$studentChatRoomsArgs<ExtArgs>
    agentChatRooms?: boolean | User$agentChatRoomsArgs<ExtArgs>
    messagesSent?: boolean | User$messagesSentArgs<ExtArgs>
    reportsSubmitted?: boolean | User$reportsSubmittedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    isEmailVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    isEmailVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    isEmailVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "phone" | "password" | "role" | "isEmailVerified" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentProfile?: boolean | User$studentProfileArgs<ExtArgs>
    agentProfile?: boolean | User$agentProfileArgs<ExtArgs>
    inquiries?: boolean | User$inquiriesArgs<ExtArgs>
    receivedInquiries?: boolean | User$receivedInquiriesArgs<ExtArgs>
    viewings?: boolean | User$viewingsArgs<ExtArgs>
    studentChatRooms?: boolean | User$studentChatRoomsArgs<ExtArgs>
    agentChatRooms?: boolean | User$agentChatRoomsArgs<ExtArgs>
    messagesSent?: boolean | User$messagesSentArgs<ExtArgs>
    reportsSubmitted?: boolean | User$reportsSubmittedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      studentProfile: Prisma.$StudentProfilePayload<ExtArgs> | null
      agentProfile: Prisma.$AgentProfilePayload<ExtArgs> | null
      inquiries: Prisma.$InquiryPayload<ExtArgs>[]
      receivedInquiries: Prisma.$InquiryPayload<ExtArgs>[]
      viewings: Prisma.$ViewingPayload<ExtArgs>[]
      studentChatRooms: Prisma.$ChatRoomPayload<ExtArgs>[]
      agentChatRooms: Prisma.$ChatRoomPayload<ExtArgs>[]
      messagesSent: Prisma.$MessagePayload<ExtArgs>[]
      reportsSubmitted: Prisma.$ReportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      phone: string
      password: string
      role: $Enums.Role
      isEmailVerified: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    studentProfile<T extends User$studentProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$studentProfileArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    agentProfile<T extends User$agentProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$agentProfileArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    inquiries<T extends User$inquiriesArgs<ExtArgs> = {}>(args?: Subset<T, User$inquiriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receivedInquiries<T extends User$receivedInquiriesArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedInquiriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    viewings<T extends User$viewingsArgs<ExtArgs> = {}>(args?: Subset<T, User$viewingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    studentChatRooms<T extends User$studentChatRoomsArgs<ExtArgs> = {}>(args?: Subset<T, User$studentChatRoomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    agentChatRooms<T extends User$agentChatRoomsArgs<ExtArgs> = {}>(args?: Subset<T, User$agentChatRoomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messagesSent<T extends User$messagesSentArgs<ExtArgs> = {}>(args?: Subset<T, User$messagesSentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reportsSubmitted<T extends User$reportsSubmittedArgs<ExtArgs> = {}>(args?: Subset<T, User$reportsSubmittedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly isEmailVerified: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.studentProfile
   */
  export type User$studentProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    where?: StudentProfileWhereInput
  }

  /**
   * User.agentProfile
   */
  export type User$agentProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    where?: AgentProfileWhereInput
  }

  /**
   * User.inquiries
   */
  export type User$inquiriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    where?: InquiryWhereInput
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    cursor?: InquiryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * User.receivedInquiries
   */
  export type User$receivedInquiriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    where?: InquiryWhereInput
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    cursor?: InquiryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * User.viewings
   */
  export type User$viewingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    where?: ViewingWhereInput
    orderBy?: ViewingOrderByWithRelationInput | ViewingOrderByWithRelationInput[]
    cursor?: ViewingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ViewingScalarFieldEnum | ViewingScalarFieldEnum[]
  }

  /**
   * User.studentChatRooms
   */
  export type User$studentChatRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    where?: ChatRoomWhereInput
    orderBy?: ChatRoomOrderByWithRelationInput | ChatRoomOrderByWithRelationInput[]
    cursor?: ChatRoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatRoomScalarFieldEnum | ChatRoomScalarFieldEnum[]
  }

  /**
   * User.agentChatRooms
   */
  export type User$agentChatRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    where?: ChatRoomWhereInput
    orderBy?: ChatRoomOrderByWithRelationInput | ChatRoomOrderByWithRelationInput[]
    cursor?: ChatRoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatRoomScalarFieldEnum | ChatRoomScalarFieldEnum[]
  }

  /**
   * User.messagesSent
   */
  export type User$messagesSentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User.reportsSubmitted
   */
  export type User$reportsSubmittedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    cursor?: ReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model StudentProfile
   */

  export type AggregateStudentProfile = {
    _count: StudentProfileCountAggregateOutputType | null
    _min: StudentProfileMinAggregateOutputType | null
    _max: StudentProfileMaxAggregateOutputType | null
  }

  export type StudentProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    university: string | null
    username: string | null
    isVerified: boolean | null
    idCardDoc: string | null
    feesReceiptDoc: string | null
    portalScreenshotDoc: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    university: string | null
    username: string | null
    isVerified: boolean | null
    idCardDoc: string | null
    feesReceiptDoc: string | null
    portalScreenshotDoc: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentProfileCountAggregateOutputType = {
    id: number
    userId: number
    fullName: number
    university: number
    username: number
    preferences: number
    isVerified: number
    idCardDoc: number
    feesReceiptDoc: number
    portalScreenshotDoc: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StudentProfileMinAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    university?: true
    username?: true
    isVerified?: true
    idCardDoc?: true
    feesReceiptDoc?: true
    portalScreenshotDoc?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    university?: true
    username?: true
    isVerified?: true
    idCardDoc?: true
    feesReceiptDoc?: true
    portalScreenshotDoc?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentProfileCountAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    university?: true
    username?: true
    preferences?: true
    isVerified?: true
    idCardDoc?: true
    feesReceiptDoc?: true
    portalScreenshotDoc?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StudentProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentProfile to aggregate.
     */
    where?: StudentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProfiles to fetch.
     */
    orderBy?: StudentProfileOrderByWithRelationInput | StudentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentProfiles
    **/
    _count?: true | StudentProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentProfileMaxAggregateInputType
  }

  export type GetStudentProfileAggregateType<T extends StudentProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentProfile[P]>
      : GetScalarType<T[P], AggregateStudentProfile[P]>
  }




  export type StudentProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentProfileWhereInput
    orderBy?: StudentProfileOrderByWithAggregationInput | StudentProfileOrderByWithAggregationInput[]
    by: StudentProfileScalarFieldEnum[] | StudentProfileScalarFieldEnum
    having?: StudentProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentProfileCountAggregateInputType | true
    _min?: StudentProfileMinAggregateInputType
    _max?: StudentProfileMaxAggregateInputType
  }

  export type StudentProfileGroupByOutputType = {
    id: string
    userId: string
    fullName: string
    university: string
    username: string
    preferences: JsonValue | null
    isVerified: boolean
    idCardDoc: string | null
    feesReceiptDoc: string | null
    portalScreenshotDoc: string | null
    createdAt: Date
    updatedAt: Date
    _count: StudentProfileCountAggregateOutputType | null
    _min: StudentProfileMinAggregateOutputType | null
    _max: StudentProfileMaxAggregateOutputType | null
  }

  type GetStudentProfileGroupByPayload<T extends StudentProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentProfileGroupByOutputType[P]>
            : GetScalarType<T[P], StudentProfileGroupByOutputType[P]>
        }
      >
    >


  export type StudentProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    university?: boolean
    username?: boolean
    preferences?: boolean
    isVerified?: boolean
    idCardDoc?: boolean
    feesReceiptDoc?: boolean
    portalScreenshotDoc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    properties?: boolean | StudentProfile$propertiesArgs<ExtArgs>
    reports?: boolean | StudentProfile$reportsArgs<ExtArgs>
    _count?: boolean | StudentProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentProfile"]>

  export type StudentProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    university?: boolean
    username?: boolean
    preferences?: boolean
    isVerified?: boolean
    idCardDoc?: boolean
    feesReceiptDoc?: boolean
    portalScreenshotDoc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentProfile"]>

  export type StudentProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    university?: boolean
    username?: boolean
    preferences?: boolean
    isVerified?: boolean
    idCardDoc?: boolean
    feesReceiptDoc?: boolean
    portalScreenshotDoc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentProfile"]>

  export type StudentProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    fullName?: boolean
    university?: boolean
    username?: boolean
    preferences?: boolean
    isVerified?: boolean
    idCardDoc?: boolean
    feesReceiptDoc?: boolean
    portalScreenshotDoc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StudentProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "fullName" | "university" | "username" | "preferences" | "isVerified" | "idCardDoc" | "feesReceiptDoc" | "portalScreenshotDoc" | "createdAt" | "updatedAt", ExtArgs["result"]["studentProfile"]>
  export type StudentProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    properties?: boolean | StudentProfile$propertiesArgs<ExtArgs>
    reports?: boolean | StudentProfile$reportsArgs<ExtArgs>
    _count?: boolean | StudentProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StudentProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StudentProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $StudentProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      properties: Prisma.$PropertyPayload<ExtArgs>[]
      reports: Prisma.$ReportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      fullName: string
      university: string
      username: string
      preferences: Prisma.JsonValue | null
      isVerified: boolean
      idCardDoc: string | null
      feesReceiptDoc: string | null
      portalScreenshotDoc: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["studentProfile"]>
    composites: {}
  }

  type StudentProfileGetPayload<S extends boolean | null | undefined | StudentProfileDefaultArgs> = $Result.GetResult<Prisma.$StudentProfilePayload, S>

  type StudentProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentProfileCountAggregateInputType | true
    }

  export interface StudentProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentProfile'], meta: { name: 'StudentProfile' } }
    /**
     * Find zero or one StudentProfile that matches the filter.
     * @param {StudentProfileFindUniqueArgs} args - Arguments to find a StudentProfile
     * @example
     * // Get one StudentProfile
     * const studentProfile = await prisma.studentProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentProfileFindUniqueArgs>(args: SelectSubset<T, StudentProfileFindUniqueArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StudentProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentProfileFindUniqueOrThrowArgs} args - Arguments to find a StudentProfile
     * @example
     * // Get one StudentProfile
     * const studentProfile = await prisma.studentProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileFindFirstArgs} args - Arguments to find a StudentProfile
     * @example
     * // Get one StudentProfile
     * const studentProfile = await prisma.studentProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentProfileFindFirstArgs>(args?: SelectSubset<T, StudentProfileFindFirstArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileFindFirstOrThrowArgs} args - Arguments to find a StudentProfile
     * @example
     * // Get one StudentProfile
     * const studentProfile = await prisma.studentProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StudentProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentProfiles
     * const studentProfiles = await prisma.studentProfile.findMany()
     * 
     * // Get first 10 StudentProfiles
     * const studentProfiles = await prisma.studentProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentProfileWithIdOnly = await prisma.studentProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentProfileFindManyArgs>(args?: SelectSubset<T, StudentProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StudentProfile.
     * @param {StudentProfileCreateArgs} args - Arguments to create a StudentProfile.
     * @example
     * // Create one StudentProfile
     * const StudentProfile = await prisma.studentProfile.create({
     *   data: {
     *     // ... data to create a StudentProfile
     *   }
     * })
     * 
     */
    create<T extends StudentProfileCreateArgs>(args: SelectSubset<T, StudentProfileCreateArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StudentProfiles.
     * @param {StudentProfileCreateManyArgs} args - Arguments to create many StudentProfiles.
     * @example
     * // Create many StudentProfiles
     * const studentProfile = await prisma.studentProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentProfileCreateManyArgs>(args?: SelectSubset<T, StudentProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentProfiles and returns the data saved in the database.
     * @param {StudentProfileCreateManyAndReturnArgs} args - Arguments to create many StudentProfiles.
     * @example
     * // Create many StudentProfiles
     * const studentProfile = await prisma.studentProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentProfiles and only return the `id`
     * const studentProfileWithIdOnly = await prisma.studentProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StudentProfile.
     * @param {StudentProfileDeleteArgs} args - Arguments to delete one StudentProfile.
     * @example
     * // Delete one StudentProfile
     * const StudentProfile = await prisma.studentProfile.delete({
     *   where: {
     *     // ... filter to delete one StudentProfile
     *   }
     * })
     * 
     */
    delete<T extends StudentProfileDeleteArgs>(args: SelectSubset<T, StudentProfileDeleteArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StudentProfile.
     * @param {StudentProfileUpdateArgs} args - Arguments to update one StudentProfile.
     * @example
     * // Update one StudentProfile
     * const studentProfile = await prisma.studentProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentProfileUpdateArgs>(args: SelectSubset<T, StudentProfileUpdateArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StudentProfiles.
     * @param {StudentProfileDeleteManyArgs} args - Arguments to filter StudentProfiles to delete.
     * @example
     * // Delete a few StudentProfiles
     * const { count } = await prisma.studentProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentProfileDeleteManyArgs>(args?: SelectSubset<T, StudentProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentProfiles
     * const studentProfile = await prisma.studentProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentProfileUpdateManyArgs>(args: SelectSubset<T, StudentProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentProfiles and returns the data updated in the database.
     * @param {StudentProfileUpdateManyAndReturnArgs} args - Arguments to update many StudentProfiles.
     * @example
     * // Update many StudentProfiles
     * const studentProfile = await prisma.studentProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StudentProfiles and only return the `id`
     * const studentProfileWithIdOnly = await prisma.studentProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StudentProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StudentProfile.
     * @param {StudentProfileUpsertArgs} args - Arguments to update or create a StudentProfile.
     * @example
     * // Update or create a StudentProfile
     * const studentProfile = await prisma.studentProfile.upsert({
     *   create: {
     *     // ... data to create a StudentProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentProfile we want to update
     *   }
     * })
     */
    upsert<T extends StudentProfileUpsertArgs>(args: SelectSubset<T, StudentProfileUpsertArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StudentProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileCountArgs} args - Arguments to filter StudentProfiles to count.
     * @example
     * // Count the number of StudentProfiles
     * const count = await prisma.studentProfile.count({
     *   where: {
     *     // ... the filter for the StudentProfiles we want to count
     *   }
     * })
    **/
    count<T extends StudentProfileCountArgs>(
      args?: Subset<T, StudentProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentProfileAggregateArgs>(args: Subset<T, StudentProfileAggregateArgs>): Prisma.PrismaPromise<GetStudentProfileAggregateType<T>>

    /**
     * Group by StudentProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentProfileGroupByArgs['orderBy'] }
        : { orderBy?: StudentProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentProfile model
   */
  readonly fields: StudentProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    properties<T extends StudentProfile$propertiesArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$propertiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reports<T extends StudentProfile$reportsArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudentProfile model
   */
  interface StudentProfileFieldRefs {
    readonly id: FieldRef<"StudentProfile", 'String'>
    readonly userId: FieldRef<"StudentProfile", 'String'>
    readonly fullName: FieldRef<"StudentProfile", 'String'>
    readonly university: FieldRef<"StudentProfile", 'String'>
    readonly username: FieldRef<"StudentProfile", 'String'>
    readonly preferences: FieldRef<"StudentProfile", 'Json'>
    readonly isVerified: FieldRef<"StudentProfile", 'Boolean'>
    readonly idCardDoc: FieldRef<"StudentProfile", 'String'>
    readonly feesReceiptDoc: FieldRef<"StudentProfile", 'String'>
    readonly portalScreenshotDoc: FieldRef<"StudentProfile", 'String'>
    readonly createdAt: FieldRef<"StudentProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"StudentProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudentProfile findUnique
   */
  export type StudentProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfile to fetch.
     */
    where: StudentProfileWhereUniqueInput
  }

  /**
   * StudentProfile findUniqueOrThrow
   */
  export type StudentProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfile to fetch.
     */
    where: StudentProfileWhereUniqueInput
  }

  /**
   * StudentProfile findFirst
   */
  export type StudentProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfile to fetch.
     */
    where?: StudentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProfiles to fetch.
     */
    orderBy?: StudentProfileOrderByWithRelationInput | StudentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentProfiles.
     */
    cursor?: StudentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentProfiles.
     */
    distinct?: StudentProfileScalarFieldEnum | StudentProfileScalarFieldEnum[]
  }

  /**
   * StudentProfile findFirstOrThrow
   */
  export type StudentProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfile to fetch.
     */
    where?: StudentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProfiles to fetch.
     */
    orderBy?: StudentProfileOrderByWithRelationInput | StudentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentProfiles.
     */
    cursor?: StudentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentProfiles.
     */
    distinct?: StudentProfileScalarFieldEnum | StudentProfileScalarFieldEnum[]
  }

  /**
   * StudentProfile findMany
   */
  export type StudentProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfiles to fetch.
     */
    where?: StudentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProfiles to fetch.
     */
    orderBy?: StudentProfileOrderByWithRelationInput | StudentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentProfiles.
     */
    cursor?: StudentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProfiles.
     */
    skip?: number
    distinct?: StudentProfileScalarFieldEnum | StudentProfileScalarFieldEnum[]
  }

  /**
   * StudentProfile create
   */
  export type StudentProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentProfile.
     */
    data: XOR<StudentProfileCreateInput, StudentProfileUncheckedCreateInput>
  }

  /**
   * StudentProfile createMany
   */
  export type StudentProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentProfiles.
     */
    data: StudentProfileCreateManyInput | StudentProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudentProfile createManyAndReturn
   */
  export type StudentProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * The data used to create many StudentProfiles.
     */
    data: StudentProfileCreateManyInput | StudentProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentProfile update
   */
  export type StudentProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentProfile.
     */
    data: XOR<StudentProfileUpdateInput, StudentProfileUncheckedUpdateInput>
    /**
     * Choose, which StudentProfile to update.
     */
    where: StudentProfileWhereUniqueInput
  }

  /**
   * StudentProfile updateMany
   */
  export type StudentProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentProfiles.
     */
    data: XOR<StudentProfileUpdateManyMutationInput, StudentProfileUncheckedUpdateManyInput>
    /**
     * Filter which StudentProfiles to update
     */
    where?: StudentProfileWhereInput
    /**
     * Limit how many StudentProfiles to update.
     */
    limit?: number
  }

  /**
   * StudentProfile updateManyAndReturn
   */
  export type StudentProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * The data used to update StudentProfiles.
     */
    data: XOR<StudentProfileUpdateManyMutationInput, StudentProfileUncheckedUpdateManyInput>
    /**
     * Filter which StudentProfiles to update
     */
    where?: StudentProfileWhereInput
    /**
     * Limit how many StudentProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentProfile upsert
   */
  export type StudentProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentProfile to update in case it exists.
     */
    where: StudentProfileWhereUniqueInput
    /**
     * In case the StudentProfile found by the `where` argument doesn't exist, create a new StudentProfile with this data.
     */
    create: XOR<StudentProfileCreateInput, StudentProfileUncheckedCreateInput>
    /**
     * In case the StudentProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentProfileUpdateInput, StudentProfileUncheckedUpdateInput>
  }

  /**
   * StudentProfile delete
   */
  export type StudentProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter which StudentProfile to delete.
     */
    where: StudentProfileWhereUniqueInput
  }

  /**
   * StudentProfile deleteMany
   */
  export type StudentProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentProfiles to delete
     */
    where?: StudentProfileWhereInput
    /**
     * Limit how many StudentProfiles to delete.
     */
    limit?: number
  }

  /**
   * StudentProfile.properties
   */
  export type StudentProfile$propertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    cursor?: PropertyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * StudentProfile.reports
   */
  export type StudentProfile$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    cursor?: ReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * StudentProfile without action
   */
  export type StudentProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
  }


  /**
   * Model AgentProfile
   */

  export type AggregateAgentProfile = {
    _count: AgentProfileCountAggregateOutputType | null
    _min: AgentProfileMinAggregateOutputType | null
    _max: AgentProfileMaxAggregateOutputType | null
  }

  export type AgentProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    address: string | null
    agencyName: string | null
    bio: string | null
    ninDocument: string | null
    isVerified: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    address: string | null
    agencyName: string | null
    bio: string | null
    ninDocument: string | null
    isVerified: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentProfileCountAggregateOutputType = {
    id: number
    userId: number
    fullName: number
    address: number
    agencyName: number
    bio: number
    ninDocument: number
    isVerified: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AgentProfileMinAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    address?: true
    agencyName?: true
    bio?: true
    ninDocument?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    address?: true
    agencyName?: true
    bio?: true
    ninDocument?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentProfileCountAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    address?: true
    agencyName?: true
    bio?: true
    ninDocument?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AgentProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentProfile to aggregate.
     */
    where?: AgentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentProfiles to fetch.
     */
    orderBy?: AgentProfileOrderByWithRelationInput | AgentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentProfiles
    **/
    _count?: true | AgentProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentProfileMaxAggregateInputType
  }

  export type GetAgentProfileAggregateType<T extends AgentProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentProfile[P]>
      : GetScalarType<T[P], AggregateAgentProfile[P]>
  }




  export type AgentProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentProfileWhereInput
    orderBy?: AgentProfileOrderByWithAggregationInput | AgentProfileOrderByWithAggregationInput[]
    by: AgentProfileScalarFieldEnum[] | AgentProfileScalarFieldEnum
    having?: AgentProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentProfileCountAggregateInputType | true
    _min?: AgentProfileMinAggregateInputType
    _max?: AgentProfileMaxAggregateInputType
  }

  export type AgentProfileGroupByOutputType = {
    id: string
    userId: string
    fullName: string
    address: string | null
    agencyName: string | null
    bio: string | null
    ninDocument: string | null
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
    _count: AgentProfileCountAggregateOutputType | null
    _min: AgentProfileMinAggregateOutputType | null
    _max: AgentProfileMaxAggregateOutputType | null
  }

  type GetAgentProfileGroupByPayload<T extends AgentProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentProfileGroupByOutputType[P]>
            : GetScalarType<T[P], AgentProfileGroupByOutputType[P]>
        }
      >
    >


  export type AgentProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    address?: boolean
    agencyName?: boolean
    bio?: boolean
    ninDocument?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    properties?: boolean | AgentProfile$propertiesArgs<ExtArgs>
    _count?: boolean | AgentProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentProfile"]>

  export type AgentProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    address?: boolean
    agencyName?: boolean
    bio?: boolean
    ninDocument?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentProfile"]>

  export type AgentProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    address?: boolean
    agencyName?: boolean
    bio?: boolean
    ninDocument?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentProfile"]>

  export type AgentProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    fullName?: boolean
    address?: boolean
    agencyName?: boolean
    bio?: boolean
    ninDocument?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AgentProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "fullName" | "address" | "agencyName" | "bio" | "ninDocument" | "isVerified" | "createdAt" | "updatedAt", ExtArgs["result"]["agentProfile"]>
  export type AgentProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    properties?: boolean | AgentProfile$propertiesArgs<ExtArgs>
    _count?: boolean | AgentProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AgentProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AgentProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AgentProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      properties: Prisma.$PropertyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      fullName: string
      address: string | null
      agencyName: string | null
      bio: string | null
      ninDocument: string | null
      isVerified: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["agentProfile"]>
    composites: {}
  }

  type AgentProfileGetPayload<S extends boolean | null | undefined | AgentProfileDefaultArgs> = $Result.GetResult<Prisma.$AgentProfilePayload, S>

  type AgentProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentProfileCountAggregateInputType | true
    }

  export interface AgentProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentProfile'], meta: { name: 'AgentProfile' } }
    /**
     * Find zero or one AgentProfile that matches the filter.
     * @param {AgentProfileFindUniqueArgs} args - Arguments to find a AgentProfile
     * @example
     * // Get one AgentProfile
     * const agentProfile = await prisma.agentProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentProfileFindUniqueArgs>(args: SelectSubset<T, AgentProfileFindUniqueArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentProfileFindUniqueOrThrowArgs} args - Arguments to find a AgentProfile
     * @example
     * // Get one AgentProfile
     * const agentProfile = await prisma.agentProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentProfileFindFirstArgs} args - Arguments to find a AgentProfile
     * @example
     * // Get one AgentProfile
     * const agentProfile = await prisma.agentProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentProfileFindFirstArgs>(args?: SelectSubset<T, AgentProfileFindFirstArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentProfileFindFirstOrThrowArgs} args - Arguments to find a AgentProfile
     * @example
     * // Get one AgentProfile
     * const agentProfile = await prisma.agentProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentProfiles
     * const agentProfiles = await prisma.agentProfile.findMany()
     * 
     * // Get first 10 AgentProfiles
     * const agentProfiles = await prisma.agentProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentProfileWithIdOnly = await prisma.agentProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentProfileFindManyArgs>(args?: SelectSubset<T, AgentProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentProfile.
     * @param {AgentProfileCreateArgs} args - Arguments to create a AgentProfile.
     * @example
     * // Create one AgentProfile
     * const AgentProfile = await prisma.agentProfile.create({
     *   data: {
     *     // ... data to create a AgentProfile
     *   }
     * })
     * 
     */
    create<T extends AgentProfileCreateArgs>(args: SelectSubset<T, AgentProfileCreateArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentProfiles.
     * @param {AgentProfileCreateManyArgs} args - Arguments to create many AgentProfiles.
     * @example
     * // Create many AgentProfiles
     * const agentProfile = await prisma.agentProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentProfileCreateManyArgs>(args?: SelectSubset<T, AgentProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentProfiles and returns the data saved in the database.
     * @param {AgentProfileCreateManyAndReturnArgs} args - Arguments to create many AgentProfiles.
     * @example
     * // Create many AgentProfiles
     * const agentProfile = await prisma.agentProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentProfiles and only return the `id`
     * const agentProfileWithIdOnly = await prisma.agentProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentProfile.
     * @param {AgentProfileDeleteArgs} args - Arguments to delete one AgentProfile.
     * @example
     * // Delete one AgentProfile
     * const AgentProfile = await prisma.agentProfile.delete({
     *   where: {
     *     // ... filter to delete one AgentProfile
     *   }
     * })
     * 
     */
    delete<T extends AgentProfileDeleteArgs>(args: SelectSubset<T, AgentProfileDeleteArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentProfile.
     * @param {AgentProfileUpdateArgs} args - Arguments to update one AgentProfile.
     * @example
     * // Update one AgentProfile
     * const agentProfile = await prisma.agentProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentProfileUpdateArgs>(args: SelectSubset<T, AgentProfileUpdateArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentProfiles.
     * @param {AgentProfileDeleteManyArgs} args - Arguments to filter AgentProfiles to delete.
     * @example
     * // Delete a few AgentProfiles
     * const { count } = await prisma.agentProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentProfileDeleteManyArgs>(args?: SelectSubset<T, AgentProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentProfiles
     * const agentProfile = await prisma.agentProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentProfileUpdateManyArgs>(args: SelectSubset<T, AgentProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentProfiles and returns the data updated in the database.
     * @param {AgentProfileUpdateManyAndReturnArgs} args - Arguments to update many AgentProfiles.
     * @example
     * // Update many AgentProfiles
     * const agentProfile = await prisma.agentProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentProfiles and only return the `id`
     * const agentProfileWithIdOnly = await prisma.agentProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentProfile.
     * @param {AgentProfileUpsertArgs} args - Arguments to update or create a AgentProfile.
     * @example
     * // Update or create a AgentProfile
     * const agentProfile = await prisma.agentProfile.upsert({
     *   create: {
     *     // ... data to create a AgentProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentProfile we want to update
     *   }
     * })
     */
    upsert<T extends AgentProfileUpsertArgs>(args: SelectSubset<T, AgentProfileUpsertArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentProfileCountArgs} args - Arguments to filter AgentProfiles to count.
     * @example
     * // Count the number of AgentProfiles
     * const count = await prisma.agentProfile.count({
     *   where: {
     *     // ... the filter for the AgentProfiles we want to count
     *   }
     * })
    **/
    count<T extends AgentProfileCountArgs>(
      args?: Subset<T, AgentProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentProfileAggregateArgs>(args: Subset<T, AgentProfileAggregateArgs>): Prisma.PrismaPromise<GetAgentProfileAggregateType<T>>

    /**
     * Group by AgentProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentProfileGroupByArgs['orderBy'] }
        : { orderBy?: AgentProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentProfile model
   */
  readonly fields: AgentProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    properties<T extends AgentProfile$propertiesArgs<ExtArgs> = {}>(args?: Subset<T, AgentProfile$propertiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentProfile model
   */
  interface AgentProfileFieldRefs {
    readonly id: FieldRef<"AgentProfile", 'String'>
    readonly userId: FieldRef<"AgentProfile", 'String'>
    readonly fullName: FieldRef<"AgentProfile", 'String'>
    readonly address: FieldRef<"AgentProfile", 'String'>
    readonly agencyName: FieldRef<"AgentProfile", 'String'>
    readonly bio: FieldRef<"AgentProfile", 'String'>
    readonly ninDocument: FieldRef<"AgentProfile", 'String'>
    readonly isVerified: FieldRef<"AgentProfile", 'Boolean'>
    readonly createdAt: FieldRef<"AgentProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"AgentProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentProfile findUnique
   */
  export type AgentProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * Filter, which AgentProfile to fetch.
     */
    where: AgentProfileWhereUniqueInput
  }

  /**
   * AgentProfile findUniqueOrThrow
   */
  export type AgentProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * Filter, which AgentProfile to fetch.
     */
    where: AgentProfileWhereUniqueInput
  }

  /**
   * AgentProfile findFirst
   */
  export type AgentProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * Filter, which AgentProfile to fetch.
     */
    where?: AgentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentProfiles to fetch.
     */
    orderBy?: AgentProfileOrderByWithRelationInput | AgentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentProfiles.
     */
    cursor?: AgentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentProfiles.
     */
    distinct?: AgentProfileScalarFieldEnum | AgentProfileScalarFieldEnum[]
  }

  /**
   * AgentProfile findFirstOrThrow
   */
  export type AgentProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * Filter, which AgentProfile to fetch.
     */
    where?: AgentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentProfiles to fetch.
     */
    orderBy?: AgentProfileOrderByWithRelationInput | AgentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentProfiles.
     */
    cursor?: AgentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentProfiles.
     */
    distinct?: AgentProfileScalarFieldEnum | AgentProfileScalarFieldEnum[]
  }

  /**
   * AgentProfile findMany
   */
  export type AgentProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * Filter, which AgentProfiles to fetch.
     */
    where?: AgentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentProfiles to fetch.
     */
    orderBy?: AgentProfileOrderByWithRelationInput | AgentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentProfiles.
     */
    cursor?: AgentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentProfiles.
     */
    skip?: number
    distinct?: AgentProfileScalarFieldEnum | AgentProfileScalarFieldEnum[]
  }

  /**
   * AgentProfile create
   */
  export type AgentProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentProfile.
     */
    data: XOR<AgentProfileCreateInput, AgentProfileUncheckedCreateInput>
  }

  /**
   * AgentProfile createMany
   */
  export type AgentProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentProfiles.
     */
    data: AgentProfileCreateManyInput | AgentProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentProfile createManyAndReturn
   */
  export type AgentProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * The data used to create many AgentProfiles.
     */
    data: AgentProfileCreateManyInput | AgentProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentProfile update
   */
  export type AgentProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentProfile.
     */
    data: XOR<AgentProfileUpdateInput, AgentProfileUncheckedUpdateInput>
    /**
     * Choose, which AgentProfile to update.
     */
    where: AgentProfileWhereUniqueInput
  }

  /**
   * AgentProfile updateMany
   */
  export type AgentProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentProfiles.
     */
    data: XOR<AgentProfileUpdateManyMutationInput, AgentProfileUncheckedUpdateManyInput>
    /**
     * Filter which AgentProfiles to update
     */
    where?: AgentProfileWhereInput
    /**
     * Limit how many AgentProfiles to update.
     */
    limit?: number
  }

  /**
   * AgentProfile updateManyAndReturn
   */
  export type AgentProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * The data used to update AgentProfiles.
     */
    data: XOR<AgentProfileUpdateManyMutationInput, AgentProfileUncheckedUpdateManyInput>
    /**
     * Filter which AgentProfiles to update
     */
    where?: AgentProfileWhereInput
    /**
     * Limit how many AgentProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentProfile upsert
   */
  export type AgentProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentProfile to update in case it exists.
     */
    where: AgentProfileWhereUniqueInput
    /**
     * In case the AgentProfile found by the `where` argument doesn't exist, create a new AgentProfile with this data.
     */
    create: XOR<AgentProfileCreateInput, AgentProfileUncheckedCreateInput>
    /**
     * In case the AgentProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentProfileUpdateInput, AgentProfileUncheckedUpdateInput>
  }

  /**
   * AgentProfile delete
   */
  export type AgentProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    /**
     * Filter which AgentProfile to delete.
     */
    where: AgentProfileWhereUniqueInput
  }

  /**
   * AgentProfile deleteMany
   */
  export type AgentProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentProfiles to delete
     */
    where?: AgentProfileWhereInput
    /**
     * Limit how many AgentProfiles to delete.
     */
    limit?: number
  }

  /**
   * AgentProfile.properties
   */
  export type AgentProfile$propertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    cursor?: PropertyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * AgentProfile without action
   */
  export type AgentProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
  }


  /**
   * Model Property
   */

  export type AggregateProperty = {
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  export type PropertyAvgAggregateOutputType = {
    price: number | null
    latitude: number | null
    longitude: number | null
    views: number | null
  }

  export type PropertySumAggregateOutputType = {
    price: number | null
    latitude: number | null
    longitude: number | null
    views: number | null
  }

  export type PropertyMinAggregateOutputType = {
    id: string | null
    title: string | null
    hostelType: string | null
    price: number | null
    location: string | null
    distance: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    isAvailable: boolean | null
    isVerified: boolean | null
    views: number | null
    university: string | null
    isRoommateOption: boolean | null
    agentId: string | null
    studentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PropertyMaxAggregateOutputType = {
    id: string | null
    title: string | null
    hostelType: string | null
    price: number | null
    location: string | null
    distance: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    isAvailable: boolean | null
    isVerified: boolean | null
    views: number | null
    university: string | null
    isRoommateOption: boolean | null
    agentId: string | null
    studentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PropertyCountAggregateOutputType = {
    id: number
    title: number
    hostelType: number
    price: number
    location: number
    distance: number
    description: number
    amenities: number
    images: number
    latitude: number
    longitude: number
    isAvailable: number
    isVerified: number
    views: number
    university: number
    isRoommateOption: number
    agentId: number
    studentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PropertyAvgAggregateInputType = {
    price?: true
    latitude?: true
    longitude?: true
    views?: true
  }

  export type PropertySumAggregateInputType = {
    price?: true
    latitude?: true
    longitude?: true
    views?: true
  }

  export type PropertyMinAggregateInputType = {
    id?: true
    title?: true
    hostelType?: true
    price?: true
    location?: true
    distance?: true
    description?: true
    latitude?: true
    longitude?: true
    isAvailable?: true
    isVerified?: true
    views?: true
    university?: true
    isRoommateOption?: true
    agentId?: true
    studentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PropertyMaxAggregateInputType = {
    id?: true
    title?: true
    hostelType?: true
    price?: true
    location?: true
    distance?: true
    description?: true
    latitude?: true
    longitude?: true
    isAvailable?: true
    isVerified?: true
    views?: true
    university?: true
    isRoommateOption?: true
    agentId?: true
    studentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PropertyCountAggregateInputType = {
    id?: true
    title?: true
    hostelType?: true
    price?: true
    location?: true
    distance?: true
    description?: true
    amenities?: true
    images?: true
    latitude?: true
    longitude?: true
    isAvailable?: true
    isVerified?: true
    views?: true
    university?: true
    isRoommateOption?: true
    agentId?: true
    studentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PropertyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Property to aggregate.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Properties
    **/
    _count?: true | PropertyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PropertyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PropertySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyMaxAggregateInputType
  }

  export type GetPropertyAggregateType<T extends PropertyAggregateArgs> = {
        [P in keyof T & keyof AggregateProperty]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProperty[P]>
      : GetScalarType<T[P], AggregateProperty[P]>
  }




  export type PropertyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithAggregationInput | PropertyOrderByWithAggregationInput[]
    by: PropertyScalarFieldEnum[] | PropertyScalarFieldEnum
    having?: PropertyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyCountAggregateInputType | true
    _avg?: PropertyAvgAggregateInputType
    _sum?: PropertySumAggregateInputType
    _min?: PropertyMinAggregateInputType
    _max?: PropertyMaxAggregateInputType
  }

  export type PropertyGroupByOutputType = {
    id: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities: string[]
    images: string[]
    latitude: number | null
    longitude: number | null
    isAvailable: boolean
    isVerified: boolean
    views: number
    university: string
    isRoommateOption: boolean
    agentId: string | null
    studentId: string | null
    createdAt: Date
    updatedAt: Date
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  type GetPropertyGroupByPayload<T extends PropertyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyGroupByOutputType[P]>
        }
      >
    >


  export type PropertySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    hostelType?: boolean
    price?: boolean
    location?: boolean
    distance?: boolean
    description?: boolean
    amenities?: boolean
    images?: boolean
    latitude?: boolean
    longitude?: boolean
    isAvailable?: boolean
    isVerified?: boolean
    views?: boolean
    university?: boolean
    isRoommateOption?: boolean
    agentId?: boolean
    studentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Property$agentArgs<ExtArgs>
    student?: boolean | Property$studentArgs<ExtArgs>
    inquiries?: boolean | Property$inquiriesArgs<ExtArgs>
    viewings?: boolean | Property$viewingsArgs<ExtArgs>
    chatRooms?: boolean | Property$chatRoomsArgs<ExtArgs>
    reports?: boolean | Property$reportsArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    hostelType?: boolean
    price?: boolean
    location?: boolean
    distance?: boolean
    description?: boolean
    amenities?: boolean
    images?: boolean
    latitude?: boolean
    longitude?: boolean
    isAvailable?: boolean
    isVerified?: boolean
    views?: boolean
    university?: boolean
    isRoommateOption?: boolean
    agentId?: boolean
    studentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Property$agentArgs<ExtArgs>
    student?: boolean | Property$studentArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    hostelType?: boolean
    price?: boolean
    location?: boolean
    distance?: boolean
    description?: boolean
    amenities?: boolean
    images?: boolean
    latitude?: boolean
    longitude?: boolean
    isAvailable?: boolean
    isVerified?: boolean
    views?: boolean
    university?: boolean
    isRoommateOption?: boolean
    agentId?: boolean
    studentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Property$agentArgs<ExtArgs>
    student?: boolean | Property$studentArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectScalar = {
    id?: boolean
    title?: boolean
    hostelType?: boolean
    price?: boolean
    location?: boolean
    distance?: boolean
    description?: boolean
    amenities?: boolean
    images?: boolean
    latitude?: boolean
    longitude?: boolean
    isAvailable?: boolean
    isVerified?: boolean
    views?: boolean
    university?: boolean
    isRoommateOption?: boolean
    agentId?: boolean
    studentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PropertyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "hostelType" | "price" | "location" | "distance" | "description" | "amenities" | "images" | "latitude" | "longitude" | "isAvailable" | "isVerified" | "views" | "university" | "isRoommateOption" | "agentId" | "studentId" | "createdAt" | "updatedAt", ExtArgs["result"]["property"]>
  export type PropertyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Property$agentArgs<ExtArgs>
    student?: boolean | Property$studentArgs<ExtArgs>
    inquiries?: boolean | Property$inquiriesArgs<ExtArgs>
    viewings?: boolean | Property$viewingsArgs<ExtArgs>
    chatRooms?: boolean | Property$chatRoomsArgs<ExtArgs>
    reports?: boolean | Property$reportsArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PropertyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Property$agentArgs<ExtArgs>
    student?: boolean | Property$studentArgs<ExtArgs>
  }
  export type PropertyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Property$agentArgs<ExtArgs>
    student?: boolean | Property$studentArgs<ExtArgs>
  }

  export type $PropertyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Property"
    objects: {
      agent: Prisma.$AgentProfilePayload<ExtArgs> | null
      student: Prisma.$StudentProfilePayload<ExtArgs> | null
      inquiries: Prisma.$InquiryPayload<ExtArgs>[]
      viewings: Prisma.$ViewingPayload<ExtArgs>[]
      chatRooms: Prisma.$ChatRoomPayload<ExtArgs>[]
      reports: Prisma.$ReportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      hostelType: string
      price: number
      location: string
      distance: string
      description: string
      amenities: string[]
      images: string[]
      latitude: number | null
      longitude: number | null
      isAvailable: boolean
      isVerified: boolean
      views: number
      university: string
      isRoommateOption: boolean
      agentId: string | null
      studentId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["property"]>
    composites: {}
  }

  type PropertyGetPayload<S extends boolean | null | undefined | PropertyDefaultArgs> = $Result.GetResult<Prisma.$PropertyPayload, S>

  type PropertyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertyCountAggregateInputType | true
    }

  export interface PropertyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Property'], meta: { name: 'Property' } }
    /**
     * Find zero or one Property that matches the filter.
     * @param {PropertyFindUniqueArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyFindUniqueArgs>(args: SelectSubset<T, PropertyFindUniqueArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Property that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertyFindUniqueOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyFindFirstArgs>(args?: SelectSubset<T, PropertyFindFirstArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Properties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Properties
     * const properties = await prisma.property.findMany()
     * 
     * // Get first 10 Properties
     * const properties = await prisma.property.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyWithIdOnly = await prisma.property.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyFindManyArgs>(args?: SelectSubset<T, PropertyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Property.
     * @param {PropertyCreateArgs} args - Arguments to create a Property.
     * @example
     * // Create one Property
     * const Property = await prisma.property.create({
     *   data: {
     *     // ... data to create a Property
     *   }
     * })
     * 
     */
    create<T extends PropertyCreateArgs>(args: SelectSubset<T, PropertyCreateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Properties.
     * @param {PropertyCreateManyArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyCreateManyArgs>(args?: SelectSubset<T, PropertyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Properties and returns the data saved in the database.
     * @param {PropertyCreateManyAndReturnArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Property.
     * @param {PropertyDeleteArgs} args - Arguments to delete one Property.
     * @example
     * // Delete one Property
     * const Property = await prisma.property.delete({
     *   where: {
     *     // ... filter to delete one Property
     *   }
     * })
     * 
     */
    delete<T extends PropertyDeleteArgs>(args: SelectSubset<T, PropertyDeleteArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Property.
     * @param {PropertyUpdateArgs} args - Arguments to update one Property.
     * @example
     * // Update one Property
     * const property = await prisma.property.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyUpdateArgs>(args: SelectSubset<T, PropertyUpdateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Properties.
     * @param {PropertyDeleteManyArgs} args - Arguments to filter Properties to delete.
     * @example
     * // Delete a few Properties
     * const { count } = await prisma.property.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyDeleteManyArgs>(args?: SelectSubset<T, PropertyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyUpdateManyArgs>(args: SelectSubset<T, PropertyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties and returns the data updated in the database.
     * @param {PropertyUpdateManyAndReturnArgs} args - Arguments to update many Properties.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertyUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Property.
     * @param {PropertyUpsertArgs} args - Arguments to update or create a Property.
     * @example
     * // Update or create a Property
     * const property = await prisma.property.upsert({
     *   create: {
     *     // ... data to create a Property
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Property we want to update
     *   }
     * })
     */
    upsert<T extends PropertyUpsertArgs>(args: SelectSubset<T, PropertyUpsertArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyCountArgs} args - Arguments to filter Properties to count.
     * @example
     * // Count the number of Properties
     * const count = await prisma.property.count({
     *   where: {
     *     // ... the filter for the Properties we want to count
     *   }
     * })
    **/
    count<T extends PropertyCountArgs>(
      args?: Subset<T, PropertyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertyAggregateArgs>(args: Subset<T, PropertyAggregateArgs>): Prisma.PrismaPromise<GetPropertyAggregateType<T>>

    /**
     * Group by Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyGroupByArgs['orderBy'] }
        : { orderBy?: PropertyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Property model
   */
  readonly fields: PropertyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Property.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agent<T extends Property$agentArgs<ExtArgs> = {}>(args?: Subset<T, Property$agentArgs<ExtArgs>>): Prisma__AgentProfileClient<$Result.GetResult<Prisma.$AgentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    student<T extends Property$studentArgs<ExtArgs> = {}>(args?: Subset<T, Property$studentArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    inquiries<T extends Property$inquiriesArgs<ExtArgs> = {}>(args?: Subset<T, Property$inquiriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    viewings<T extends Property$viewingsArgs<ExtArgs> = {}>(args?: Subset<T, Property$viewingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatRooms<T extends Property$chatRoomsArgs<ExtArgs> = {}>(args?: Subset<T, Property$chatRoomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reports<T extends Property$reportsArgs<ExtArgs> = {}>(args?: Subset<T, Property$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Property model
   */
  interface PropertyFieldRefs {
    readonly id: FieldRef<"Property", 'String'>
    readonly title: FieldRef<"Property", 'String'>
    readonly hostelType: FieldRef<"Property", 'String'>
    readonly price: FieldRef<"Property", 'Float'>
    readonly location: FieldRef<"Property", 'String'>
    readonly distance: FieldRef<"Property", 'String'>
    readonly description: FieldRef<"Property", 'String'>
    readonly amenities: FieldRef<"Property", 'String[]'>
    readonly images: FieldRef<"Property", 'String[]'>
    readonly latitude: FieldRef<"Property", 'Float'>
    readonly longitude: FieldRef<"Property", 'Float'>
    readonly isAvailable: FieldRef<"Property", 'Boolean'>
    readonly isVerified: FieldRef<"Property", 'Boolean'>
    readonly views: FieldRef<"Property", 'Int'>
    readonly university: FieldRef<"Property", 'String'>
    readonly isRoommateOption: FieldRef<"Property", 'Boolean'>
    readonly agentId: FieldRef<"Property", 'String'>
    readonly studentId: FieldRef<"Property", 'String'>
    readonly createdAt: FieldRef<"Property", 'DateTime'>
    readonly updatedAt: FieldRef<"Property", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Property findUnique
   */
  export type PropertyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findUniqueOrThrow
   */
  export type PropertyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findFirst
   */
  export type PropertyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findFirstOrThrow
   */
  export type PropertyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findMany
   */
  export type PropertyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Properties to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property create
   */
  export type PropertyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to create a Property.
     */
    data: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
  }

  /**
   * Property createMany
   */
  export type PropertyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property createManyAndReturn
   */
  export type PropertyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Property update
   */
  export type PropertyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to update a Property.
     */
    data: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
    /**
     * Choose, which Property to update.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property updateMany
   */
  export type PropertyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
  }

  /**
   * Property updateManyAndReturn
   */
  export type PropertyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Property upsert
   */
  export type PropertyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The filter to search for the Property to update in case it exists.
     */
    where: PropertyWhereUniqueInput
    /**
     * In case the Property found by the `where` argument doesn't exist, create a new Property with this data.
     */
    create: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
    /**
     * In case the Property was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
  }

  /**
   * Property delete
   */
  export type PropertyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter which Property to delete.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property deleteMany
   */
  export type PropertyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Properties to delete
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to delete.
     */
    limit?: number
  }

  /**
   * Property.agent
   */
  export type Property$agentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentProfile
     */
    select?: AgentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentProfile
     */
    omit?: AgentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentProfileInclude<ExtArgs> | null
    where?: AgentProfileWhereInput
  }

  /**
   * Property.student
   */
  export type Property$studentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    where?: StudentProfileWhereInput
  }

  /**
   * Property.inquiries
   */
  export type Property$inquiriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    where?: InquiryWhereInput
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    cursor?: InquiryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Property.viewings
   */
  export type Property$viewingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    where?: ViewingWhereInput
    orderBy?: ViewingOrderByWithRelationInput | ViewingOrderByWithRelationInput[]
    cursor?: ViewingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ViewingScalarFieldEnum | ViewingScalarFieldEnum[]
  }

  /**
   * Property.chatRooms
   */
  export type Property$chatRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    where?: ChatRoomWhereInput
    orderBy?: ChatRoomOrderByWithRelationInput | ChatRoomOrderByWithRelationInput[]
    cursor?: ChatRoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatRoomScalarFieldEnum | ChatRoomScalarFieldEnum[]
  }

  /**
   * Property.reports
   */
  export type Property$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    cursor?: ReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Property without action
   */
  export type PropertyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
  }


  /**
   * Model Inquiry
   */

  export type AggregateInquiry = {
    _count: InquiryCountAggregateOutputType | null
    _min: InquiryMinAggregateOutputType | null
    _max: InquiryMaxAggregateOutputType | null
  }

  export type InquiryMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    propertyId: string | null
    agentId: string | null
    message: string | null
    createdAt: Date | null
  }

  export type InquiryMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    propertyId: string | null
    agentId: string | null
    message: string | null
    createdAt: Date | null
  }

  export type InquiryCountAggregateOutputType = {
    id: number
    studentId: number
    propertyId: number
    agentId: number
    message: number
    createdAt: number
    _all: number
  }


  export type InquiryMinAggregateInputType = {
    id?: true
    studentId?: true
    propertyId?: true
    agentId?: true
    message?: true
    createdAt?: true
  }

  export type InquiryMaxAggregateInputType = {
    id?: true
    studentId?: true
    propertyId?: true
    agentId?: true
    message?: true
    createdAt?: true
  }

  export type InquiryCountAggregateInputType = {
    id?: true
    studentId?: true
    propertyId?: true
    agentId?: true
    message?: true
    createdAt?: true
    _all?: true
  }

  export type InquiryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inquiry to aggregate.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inquiries
    **/
    _count?: true | InquiryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InquiryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InquiryMaxAggregateInputType
  }

  export type GetInquiryAggregateType<T extends InquiryAggregateArgs> = {
        [P in keyof T & keyof AggregateInquiry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInquiry[P]>
      : GetScalarType<T[P], AggregateInquiry[P]>
  }




  export type InquiryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiryWhereInput
    orderBy?: InquiryOrderByWithAggregationInput | InquiryOrderByWithAggregationInput[]
    by: InquiryScalarFieldEnum[] | InquiryScalarFieldEnum
    having?: InquiryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InquiryCountAggregateInputType | true
    _min?: InquiryMinAggregateInputType
    _max?: InquiryMaxAggregateInputType
  }

  export type InquiryGroupByOutputType = {
    id: string
    studentId: string
    propertyId: string
    agentId: string
    message: string
    createdAt: Date
    _count: InquiryCountAggregateOutputType | null
    _min: InquiryMinAggregateOutputType | null
    _max: InquiryMaxAggregateOutputType | null
  }

  type GetInquiryGroupByPayload<T extends InquiryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InquiryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InquiryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InquiryGroupByOutputType[P]>
            : GetScalarType<T[P], InquiryGroupByOutputType[P]>
        }
      >
    >


  export type InquirySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    propertyId?: boolean
    agentId?: boolean
    message?: boolean
    createdAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inquiry"]>

  export type InquirySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    propertyId?: boolean
    agentId?: boolean
    message?: boolean
    createdAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inquiry"]>

  export type InquirySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    propertyId?: boolean
    agentId?: boolean
    message?: boolean
    createdAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inquiry"]>

  export type InquirySelectScalar = {
    id?: boolean
    studentId?: boolean
    propertyId?: boolean
    agentId?: boolean
    message?: boolean
    createdAt?: boolean
  }

  export type InquiryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "propertyId" | "agentId" | "message" | "createdAt", ExtArgs["result"]["inquiry"]>
  export type InquiryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InquiryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InquiryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $InquiryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inquiry"
    objects: {
      student: Prisma.$UserPayload<ExtArgs>
      property: Prisma.$PropertyPayload<ExtArgs>
      agent: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      propertyId: string
      agentId: string
      message: string
      createdAt: Date
    }, ExtArgs["result"]["inquiry"]>
    composites: {}
  }

  type InquiryGetPayload<S extends boolean | null | undefined | InquiryDefaultArgs> = $Result.GetResult<Prisma.$InquiryPayload, S>

  type InquiryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InquiryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InquiryCountAggregateInputType | true
    }

  export interface InquiryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inquiry'], meta: { name: 'Inquiry' } }
    /**
     * Find zero or one Inquiry that matches the filter.
     * @param {InquiryFindUniqueArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InquiryFindUniqueArgs>(args: SelectSubset<T, InquiryFindUniqueArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inquiry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InquiryFindUniqueOrThrowArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InquiryFindUniqueOrThrowArgs>(args: SelectSubset<T, InquiryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inquiry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindFirstArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InquiryFindFirstArgs>(args?: SelectSubset<T, InquiryFindFirstArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inquiry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindFirstOrThrowArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InquiryFindFirstOrThrowArgs>(args?: SelectSubset<T, InquiryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inquiries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inquiries
     * const inquiries = await prisma.inquiry.findMany()
     * 
     * // Get first 10 Inquiries
     * const inquiries = await prisma.inquiry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inquiryWithIdOnly = await prisma.inquiry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InquiryFindManyArgs>(args?: SelectSubset<T, InquiryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inquiry.
     * @param {InquiryCreateArgs} args - Arguments to create a Inquiry.
     * @example
     * // Create one Inquiry
     * const Inquiry = await prisma.inquiry.create({
     *   data: {
     *     // ... data to create a Inquiry
     *   }
     * })
     * 
     */
    create<T extends InquiryCreateArgs>(args: SelectSubset<T, InquiryCreateArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inquiries.
     * @param {InquiryCreateManyArgs} args - Arguments to create many Inquiries.
     * @example
     * // Create many Inquiries
     * const inquiry = await prisma.inquiry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InquiryCreateManyArgs>(args?: SelectSubset<T, InquiryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inquiries and returns the data saved in the database.
     * @param {InquiryCreateManyAndReturnArgs} args - Arguments to create many Inquiries.
     * @example
     * // Create many Inquiries
     * const inquiry = await prisma.inquiry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inquiries and only return the `id`
     * const inquiryWithIdOnly = await prisma.inquiry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InquiryCreateManyAndReturnArgs>(args?: SelectSubset<T, InquiryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inquiry.
     * @param {InquiryDeleteArgs} args - Arguments to delete one Inquiry.
     * @example
     * // Delete one Inquiry
     * const Inquiry = await prisma.inquiry.delete({
     *   where: {
     *     // ... filter to delete one Inquiry
     *   }
     * })
     * 
     */
    delete<T extends InquiryDeleteArgs>(args: SelectSubset<T, InquiryDeleteArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inquiry.
     * @param {InquiryUpdateArgs} args - Arguments to update one Inquiry.
     * @example
     * // Update one Inquiry
     * const inquiry = await prisma.inquiry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InquiryUpdateArgs>(args: SelectSubset<T, InquiryUpdateArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inquiries.
     * @param {InquiryDeleteManyArgs} args - Arguments to filter Inquiries to delete.
     * @example
     * // Delete a few Inquiries
     * const { count } = await prisma.inquiry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InquiryDeleteManyArgs>(args?: SelectSubset<T, InquiryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inquiries
     * const inquiry = await prisma.inquiry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InquiryUpdateManyArgs>(args: SelectSubset<T, InquiryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inquiries and returns the data updated in the database.
     * @param {InquiryUpdateManyAndReturnArgs} args - Arguments to update many Inquiries.
     * @example
     * // Update many Inquiries
     * const inquiry = await prisma.inquiry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inquiries and only return the `id`
     * const inquiryWithIdOnly = await prisma.inquiry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InquiryUpdateManyAndReturnArgs>(args: SelectSubset<T, InquiryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inquiry.
     * @param {InquiryUpsertArgs} args - Arguments to update or create a Inquiry.
     * @example
     * // Update or create a Inquiry
     * const inquiry = await prisma.inquiry.upsert({
     *   create: {
     *     // ... data to create a Inquiry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inquiry we want to update
     *   }
     * })
     */
    upsert<T extends InquiryUpsertArgs>(args: SelectSubset<T, InquiryUpsertArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryCountArgs} args - Arguments to filter Inquiries to count.
     * @example
     * // Count the number of Inquiries
     * const count = await prisma.inquiry.count({
     *   where: {
     *     // ... the filter for the Inquiries we want to count
     *   }
     * })
    **/
    count<T extends InquiryCountArgs>(
      args?: Subset<T, InquiryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InquiryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inquiry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InquiryAggregateArgs>(args: Subset<T, InquiryAggregateArgs>): Prisma.PrismaPromise<GetInquiryAggregateType<T>>

    /**
     * Group by Inquiry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InquiryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InquiryGroupByArgs['orderBy'] }
        : { orderBy?: InquiryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InquiryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInquiryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inquiry model
   */
  readonly fields: InquiryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inquiry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InquiryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    agent<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Inquiry model
   */
  interface InquiryFieldRefs {
    readonly id: FieldRef<"Inquiry", 'String'>
    readonly studentId: FieldRef<"Inquiry", 'String'>
    readonly propertyId: FieldRef<"Inquiry", 'String'>
    readonly agentId: FieldRef<"Inquiry", 'String'>
    readonly message: FieldRef<"Inquiry", 'String'>
    readonly createdAt: FieldRef<"Inquiry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inquiry findUnique
   */
  export type InquiryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry findUniqueOrThrow
   */
  export type InquiryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry findFirst
   */
  export type InquiryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inquiries.
     */
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry findFirstOrThrow
   */
  export type InquiryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inquiries.
     */
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry findMany
   */
  export type InquiryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiries to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry create
   */
  export type InquiryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * The data needed to create a Inquiry.
     */
    data: XOR<InquiryCreateInput, InquiryUncheckedCreateInput>
  }

  /**
   * Inquiry createMany
   */
  export type InquiryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inquiries.
     */
    data: InquiryCreateManyInput | InquiryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inquiry createManyAndReturn
   */
  export type InquiryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * The data used to create many Inquiries.
     */
    data: InquiryCreateManyInput | InquiryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inquiry update
   */
  export type InquiryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * The data needed to update a Inquiry.
     */
    data: XOR<InquiryUpdateInput, InquiryUncheckedUpdateInput>
    /**
     * Choose, which Inquiry to update.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry updateMany
   */
  export type InquiryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inquiries.
     */
    data: XOR<InquiryUpdateManyMutationInput, InquiryUncheckedUpdateManyInput>
    /**
     * Filter which Inquiries to update
     */
    where?: InquiryWhereInput
    /**
     * Limit how many Inquiries to update.
     */
    limit?: number
  }

  /**
   * Inquiry updateManyAndReturn
   */
  export type InquiryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * The data used to update Inquiries.
     */
    data: XOR<InquiryUpdateManyMutationInput, InquiryUncheckedUpdateManyInput>
    /**
     * Filter which Inquiries to update
     */
    where?: InquiryWhereInput
    /**
     * Limit how many Inquiries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inquiry upsert
   */
  export type InquiryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * The filter to search for the Inquiry to update in case it exists.
     */
    where: InquiryWhereUniqueInput
    /**
     * In case the Inquiry found by the `where` argument doesn't exist, create a new Inquiry with this data.
     */
    create: XOR<InquiryCreateInput, InquiryUncheckedCreateInput>
    /**
     * In case the Inquiry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InquiryUpdateInput, InquiryUncheckedUpdateInput>
  }

  /**
   * Inquiry delete
   */
  export type InquiryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter which Inquiry to delete.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry deleteMany
   */
  export type InquiryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inquiries to delete
     */
    where?: InquiryWhereInput
    /**
     * Limit how many Inquiries to delete.
     */
    limit?: number
  }

  /**
   * Inquiry without action
   */
  export type InquiryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
  }


  /**
   * Model Viewing
   */

  export type AggregateViewing = {
    _count: ViewingCountAggregateOutputType | null
    _min: ViewingMinAggregateOutputType | null
    _max: ViewingMaxAggregateOutputType | null
  }

  export type ViewingMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    propertyId: string | null
    dateTime: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ViewingMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    propertyId: string | null
    dateTime: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ViewingCountAggregateOutputType = {
    id: number
    studentId: number
    propertyId: number
    dateTime: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ViewingMinAggregateInputType = {
    id?: true
    studentId?: true
    propertyId?: true
    dateTime?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ViewingMaxAggregateInputType = {
    id?: true
    studentId?: true
    propertyId?: true
    dateTime?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ViewingCountAggregateInputType = {
    id?: true
    studentId?: true
    propertyId?: true
    dateTime?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ViewingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Viewing to aggregate.
     */
    where?: ViewingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Viewings to fetch.
     */
    orderBy?: ViewingOrderByWithRelationInput | ViewingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ViewingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Viewings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Viewings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Viewings
    **/
    _count?: true | ViewingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ViewingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ViewingMaxAggregateInputType
  }

  export type GetViewingAggregateType<T extends ViewingAggregateArgs> = {
        [P in keyof T & keyof AggregateViewing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateViewing[P]>
      : GetScalarType<T[P], AggregateViewing[P]>
  }




  export type ViewingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ViewingWhereInput
    orderBy?: ViewingOrderByWithAggregationInput | ViewingOrderByWithAggregationInput[]
    by: ViewingScalarFieldEnum[] | ViewingScalarFieldEnum
    having?: ViewingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ViewingCountAggregateInputType | true
    _min?: ViewingMinAggregateInputType
    _max?: ViewingMaxAggregateInputType
  }

  export type ViewingGroupByOutputType = {
    id: string
    studentId: string
    propertyId: string
    dateTime: Date
    status: string
    createdAt: Date
    updatedAt: Date
    _count: ViewingCountAggregateOutputType | null
    _min: ViewingMinAggregateOutputType | null
    _max: ViewingMaxAggregateOutputType | null
  }

  type GetViewingGroupByPayload<T extends ViewingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ViewingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ViewingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ViewingGroupByOutputType[P]>
            : GetScalarType<T[P], ViewingGroupByOutputType[P]>
        }
      >
    >


  export type ViewingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    propertyId?: boolean
    dateTime?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["viewing"]>

  export type ViewingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    propertyId?: boolean
    dateTime?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["viewing"]>

  export type ViewingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    propertyId?: boolean
    dateTime?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["viewing"]>

  export type ViewingSelectScalar = {
    id?: boolean
    studentId?: boolean
    propertyId?: boolean
    dateTime?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ViewingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "propertyId" | "dateTime" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["viewing"]>
  export type ViewingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type ViewingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type ViewingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $ViewingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Viewing"
    objects: {
      student: Prisma.$UserPayload<ExtArgs>
      property: Prisma.$PropertyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      propertyId: string
      dateTime: Date
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["viewing"]>
    composites: {}
  }

  type ViewingGetPayload<S extends boolean | null | undefined | ViewingDefaultArgs> = $Result.GetResult<Prisma.$ViewingPayload, S>

  type ViewingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ViewingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ViewingCountAggregateInputType | true
    }

  export interface ViewingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Viewing'], meta: { name: 'Viewing' } }
    /**
     * Find zero or one Viewing that matches the filter.
     * @param {ViewingFindUniqueArgs} args - Arguments to find a Viewing
     * @example
     * // Get one Viewing
     * const viewing = await prisma.viewing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ViewingFindUniqueArgs>(args: SelectSubset<T, ViewingFindUniqueArgs<ExtArgs>>): Prisma__ViewingClient<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Viewing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ViewingFindUniqueOrThrowArgs} args - Arguments to find a Viewing
     * @example
     * // Get one Viewing
     * const viewing = await prisma.viewing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ViewingFindUniqueOrThrowArgs>(args: SelectSubset<T, ViewingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ViewingClient<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Viewing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViewingFindFirstArgs} args - Arguments to find a Viewing
     * @example
     * // Get one Viewing
     * const viewing = await prisma.viewing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ViewingFindFirstArgs>(args?: SelectSubset<T, ViewingFindFirstArgs<ExtArgs>>): Prisma__ViewingClient<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Viewing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViewingFindFirstOrThrowArgs} args - Arguments to find a Viewing
     * @example
     * // Get one Viewing
     * const viewing = await prisma.viewing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ViewingFindFirstOrThrowArgs>(args?: SelectSubset<T, ViewingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ViewingClient<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Viewings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViewingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Viewings
     * const viewings = await prisma.viewing.findMany()
     * 
     * // Get first 10 Viewings
     * const viewings = await prisma.viewing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const viewingWithIdOnly = await prisma.viewing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ViewingFindManyArgs>(args?: SelectSubset<T, ViewingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Viewing.
     * @param {ViewingCreateArgs} args - Arguments to create a Viewing.
     * @example
     * // Create one Viewing
     * const Viewing = await prisma.viewing.create({
     *   data: {
     *     // ... data to create a Viewing
     *   }
     * })
     * 
     */
    create<T extends ViewingCreateArgs>(args: SelectSubset<T, ViewingCreateArgs<ExtArgs>>): Prisma__ViewingClient<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Viewings.
     * @param {ViewingCreateManyArgs} args - Arguments to create many Viewings.
     * @example
     * // Create many Viewings
     * const viewing = await prisma.viewing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ViewingCreateManyArgs>(args?: SelectSubset<T, ViewingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Viewings and returns the data saved in the database.
     * @param {ViewingCreateManyAndReturnArgs} args - Arguments to create many Viewings.
     * @example
     * // Create many Viewings
     * const viewing = await prisma.viewing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Viewings and only return the `id`
     * const viewingWithIdOnly = await prisma.viewing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ViewingCreateManyAndReturnArgs>(args?: SelectSubset<T, ViewingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Viewing.
     * @param {ViewingDeleteArgs} args - Arguments to delete one Viewing.
     * @example
     * // Delete one Viewing
     * const Viewing = await prisma.viewing.delete({
     *   where: {
     *     // ... filter to delete one Viewing
     *   }
     * })
     * 
     */
    delete<T extends ViewingDeleteArgs>(args: SelectSubset<T, ViewingDeleteArgs<ExtArgs>>): Prisma__ViewingClient<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Viewing.
     * @param {ViewingUpdateArgs} args - Arguments to update one Viewing.
     * @example
     * // Update one Viewing
     * const viewing = await prisma.viewing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ViewingUpdateArgs>(args: SelectSubset<T, ViewingUpdateArgs<ExtArgs>>): Prisma__ViewingClient<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Viewings.
     * @param {ViewingDeleteManyArgs} args - Arguments to filter Viewings to delete.
     * @example
     * // Delete a few Viewings
     * const { count } = await prisma.viewing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ViewingDeleteManyArgs>(args?: SelectSubset<T, ViewingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Viewings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViewingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Viewings
     * const viewing = await prisma.viewing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ViewingUpdateManyArgs>(args: SelectSubset<T, ViewingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Viewings and returns the data updated in the database.
     * @param {ViewingUpdateManyAndReturnArgs} args - Arguments to update many Viewings.
     * @example
     * // Update many Viewings
     * const viewing = await prisma.viewing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Viewings and only return the `id`
     * const viewingWithIdOnly = await prisma.viewing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ViewingUpdateManyAndReturnArgs>(args: SelectSubset<T, ViewingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Viewing.
     * @param {ViewingUpsertArgs} args - Arguments to update or create a Viewing.
     * @example
     * // Update or create a Viewing
     * const viewing = await prisma.viewing.upsert({
     *   create: {
     *     // ... data to create a Viewing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Viewing we want to update
     *   }
     * })
     */
    upsert<T extends ViewingUpsertArgs>(args: SelectSubset<T, ViewingUpsertArgs<ExtArgs>>): Prisma__ViewingClient<$Result.GetResult<Prisma.$ViewingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Viewings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViewingCountArgs} args - Arguments to filter Viewings to count.
     * @example
     * // Count the number of Viewings
     * const count = await prisma.viewing.count({
     *   where: {
     *     // ... the filter for the Viewings we want to count
     *   }
     * })
    **/
    count<T extends ViewingCountArgs>(
      args?: Subset<T, ViewingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ViewingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Viewing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViewingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ViewingAggregateArgs>(args: Subset<T, ViewingAggregateArgs>): Prisma.PrismaPromise<GetViewingAggregateType<T>>

    /**
     * Group by Viewing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViewingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ViewingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ViewingGroupByArgs['orderBy'] }
        : { orderBy?: ViewingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ViewingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetViewingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Viewing model
   */
  readonly fields: ViewingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Viewing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ViewingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Viewing model
   */
  interface ViewingFieldRefs {
    readonly id: FieldRef<"Viewing", 'String'>
    readonly studentId: FieldRef<"Viewing", 'String'>
    readonly propertyId: FieldRef<"Viewing", 'String'>
    readonly dateTime: FieldRef<"Viewing", 'DateTime'>
    readonly status: FieldRef<"Viewing", 'String'>
    readonly createdAt: FieldRef<"Viewing", 'DateTime'>
    readonly updatedAt: FieldRef<"Viewing", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Viewing findUnique
   */
  export type ViewingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * Filter, which Viewing to fetch.
     */
    where: ViewingWhereUniqueInput
  }

  /**
   * Viewing findUniqueOrThrow
   */
  export type ViewingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * Filter, which Viewing to fetch.
     */
    where: ViewingWhereUniqueInput
  }

  /**
   * Viewing findFirst
   */
  export type ViewingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * Filter, which Viewing to fetch.
     */
    where?: ViewingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Viewings to fetch.
     */
    orderBy?: ViewingOrderByWithRelationInput | ViewingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Viewings.
     */
    cursor?: ViewingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Viewings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Viewings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Viewings.
     */
    distinct?: ViewingScalarFieldEnum | ViewingScalarFieldEnum[]
  }

  /**
   * Viewing findFirstOrThrow
   */
  export type ViewingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * Filter, which Viewing to fetch.
     */
    where?: ViewingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Viewings to fetch.
     */
    orderBy?: ViewingOrderByWithRelationInput | ViewingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Viewings.
     */
    cursor?: ViewingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Viewings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Viewings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Viewings.
     */
    distinct?: ViewingScalarFieldEnum | ViewingScalarFieldEnum[]
  }

  /**
   * Viewing findMany
   */
  export type ViewingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * Filter, which Viewings to fetch.
     */
    where?: ViewingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Viewings to fetch.
     */
    orderBy?: ViewingOrderByWithRelationInput | ViewingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Viewings.
     */
    cursor?: ViewingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Viewings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Viewings.
     */
    skip?: number
    distinct?: ViewingScalarFieldEnum | ViewingScalarFieldEnum[]
  }

  /**
   * Viewing create
   */
  export type ViewingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * The data needed to create a Viewing.
     */
    data: XOR<ViewingCreateInput, ViewingUncheckedCreateInput>
  }

  /**
   * Viewing createMany
   */
  export type ViewingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Viewings.
     */
    data: ViewingCreateManyInput | ViewingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Viewing createManyAndReturn
   */
  export type ViewingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * The data used to create many Viewings.
     */
    data: ViewingCreateManyInput | ViewingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Viewing update
   */
  export type ViewingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * The data needed to update a Viewing.
     */
    data: XOR<ViewingUpdateInput, ViewingUncheckedUpdateInput>
    /**
     * Choose, which Viewing to update.
     */
    where: ViewingWhereUniqueInput
  }

  /**
   * Viewing updateMany
   */
  export type ViewingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Viewings.
     */
    data: XOR<ViewingUpdateManyMutationInput, ViewingUncheckedUpdateManyInput>
    /**
     * Filter which Viewings to update
     */
    where?: ViewingWhereInput
    /**
     * Limit how many Viewings to update.
     */
    limit?: number
  }

  /**
   * Viewing updateManyAndReturn
   */
  export type ViewingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * The data used to update Viewings.
     */
    data: XOR<ViewingUpdateManyMutationInput, ViewingUncheckedUpdateManyInput>
    /**
     * Filter which Viewings to update
     */
    where?: ViewingWhereInput
    /**
     * Limit how many Viewings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Viewing upsert
   */
  export type ViewingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * The filter to search for the Viewing to update in case it exists.
     */
    where: ViewingWhereUniqueInput
    /**
     * In case the Viewing found by the `where` argument doesn't exist, create a new Viewing with this data.
     */
    create: XOR<ViewingCreateInput, ViewingUncheckedCreateInput>
    /**
     * In case the Viewing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ViewingUpdateInput, ViewingUncheckedUpdateInput>
  }

  /**
   * Viewing delete
   */
  export type ViewingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
    /**
     * Filter which Viewing to delete.
     */
    where: ViewingWhereUniqueInput
  }

  /**
   * Viewing deleteMany
   */
  export type ViewingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Viewings to delete
     */
    where?: ViewingWhereInput
    /**
     * Limit how many Viewings to delete.
     */
    limit?: number
  }

  /**
   * Viewing without action
   */
  export type ViewingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viewing
     */
    select?: ViewingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viewing
     */
    omit?: ViewingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViewingInclude<ExtArgs> | null
  }


  /**
   * Model ChatRoom
   */

  export type AggregateChatRoom = {
    _count: ChatRoomCountAggregateOutputType | null
    _min: ChatRoomMinAggregateOutputType | null
    _max: ChatRoomMaxAggregateOutputType | null
  }

  export type ChatRoomMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    agentId: string | null
    propertyId: string | null
    createdAt: Date | null
  }

  export type ChatRoomMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    agentId: string | null
    propertyId: string | null
    createdAt: Date | null
  }

  export type ChatRoomCountAggregateOutputType = {
    id: number
    studentId: number
    agentId: number
    propertyId: number
    createdAt: number
    _all: number
  }


  export type ChatRoomMinAggregateInputType = {
    id?: true
    studentId?: true
    agentId?: true
    propertyId?: true
    createdAt?: true
  }

  export type ChatRoomMaxAggregateInputType = {
    id?: true
    studentId?: true
    agentId?: true
    propertyId?: true
    createdAt?: true
  }

  export type ChatRoomCountAggregateInputType = {
    id?: true
    studentId?: true
    agentId?: true
    propertyId?: true
    createdAt?: true
    _all?: true
  }

  export type ChatRoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatRoom to aggregate.
     */
    where?: ChatRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatRooms to fetch.
     */
    orderBy?: ChatRoomOrderByWithRelationInput | ChatRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatRooms
    **/
    _count?: true | ChatRoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatRoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatRoomMaxAggregateInputType
  }

  export type GetChatRoomAggregateType<T extends ChatRoomAggregateArgs> = {
        [P in keyof T & keyof AggregateChatRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatRoom[P]>
      : GetScalarType<T[P], AggregateChatRoom[P]>
  }




  export type ChatRoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatRoomWhereInput
    orderBy?: ChatRoomOrderByWithAggregationInput | ChatRoomOrderByWithAggregationInput[]
    by: ChatRoomScalarFieldEnum[] | ChatRoomScalarFieldEnum
    having?: ChatRoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatRoomCountAggregateInputType | true
    _min?: ChatRoomMinAggregateInputType
    _max?: ChatRoomMaxAggregateInputType
  }

  export type ChatRoomGroupByOutputType = {
    id: string
    studentId: string
    agentId: string
    propertyId: string
    createdAt: Date
    _count: ChatRoomCountAggregateOutputType | null
    _min: ChatRoomMinAggregateOutputType | null
    _max: ChatRoomMaxAggregateOutputType | null
  }

  type GetChatRoomGroupByPayload<T extends ChatRoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatRoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatRoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatRoomGroupByOutputType[P]>
            : GetScalarType<T[P], ChatRoomGroupByOutputType[P]>
        }
      >
    >


  export type ChatRoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    agentId?: boolean
    propertyId?: boolean
    createdAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    messages?: boolean | ChatRoom$messagesArgs<ExtArgs>
    _count?: boolean | ChatRoomCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatRoom"]>

  export type ChatRoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    agentId?: boolean
    propertyId?: boolean
    createdAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatRoom"]>

  export type ChatRoomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    agentId?: boolean
    propertyId?: boolean
    createdAt?: boolean
    student?: boolean | UserDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatRoom"]>

  export type ChatRoomSelectScalar = {
    id?: boolean
    studentId?: boolean
    agentId?: boolean
    propertyId?: boolean
    createdAt?: boolean
  }

  export type ChatRoomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "agentId" | "propertyId" | "createdAt", ExtArgs["result"]["chatRoom"]>
  export type ChatRoomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    messages?: boolean | ChatRoom$messagesArgs<ExtArgs>
    _count?: boolean | ChatRoomCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatRoomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type ChatRoomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | UserDefaultArgs<ExtArgs>
    agent?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $ChatRoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatRoom"
    objects: {
      student: Prisma.$UserPayload<ExtArgs>
      agent: Prisma.$UserPayload<ExtArgs>
      property: Prisma.$PropertyPayload<ExtArgs>
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      agentId: string
      propertyId: string
      createdAt: Date
    }, ExtArgs["result"]["chatRoom"]>
    composites: {}
  }

  type ChatRoomGetPayload<S extends boolean | null | undefined | ChatRoomDefaultArgs> = $Result.GetResult<Prisma.$ChatRoomPayload, S>

  type ChatRoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatRoomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatRoomCountAggregateInputType | true
    }

  export interface ChatRoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatRoom'], meta: { name: 'ChatRoom' } }
    /**
     * Find zero or one ChatRoom that matches the filter.
     * @param {ChatRoomFindUniqueArgs} args - Arguments to find a ChatRoom
     * @example
     * // Get one ChatRoom
     * const chatRoom = await prisma.chatRoom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatRoomFindUniqueArgs>(args: SelectSubset<T, ChatRoomFindUniqueArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatRoom that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatRoomFindUniqueOrThrowArgs} args - Arguments to find a ChatRoom
     * @example
     * // Get one ChatRoom
     * const chatRoom = await prisma.chatRoom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatRoomFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatRoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatRoom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatRoomFindFirstArgs} args - Arguments to find a ChatRoom
     * @example
     * // Get one ChatRoom
     * const chatRoom = await prisma.chatRoom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatRoomFindFirstArgs>(args?: SelectSubset<T, ChatRoomFindFirstArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatRoom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatRoomFindFirstOrThrowArgs} args - Arguments to find a ChatRoom
     * @example
     * // Get one ChatRoom
     * const chatRoom = await prisma.chatRoom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatRoomFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatRoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatRooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatRoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatRooms
     * const chatRooms = await prisma.chatRoom.findMany()
     * 
     * // Get first 10 ChatRooms
     * const chatRooms = await prisma.chatRoom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatRoomWithIdOnly = await prisma.chatRoom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatRoomFindManyArgs>(args?: SelectSubset<T, ChatRoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatRoom.
     * @param {ChatRoomCreateArgs} args - Arguments to create a ChatRoom.
     * @example
     * // Create one ChatRoom
     * const ChatRoom = await prisma.chatRoom.create({
     *   data: {
     *     // ... data to create a ChatRoom
     *   }
     * })
     * 
     */
    create<T extends ChatRoomCreateArgs>(args: SelectSubset<T, ChatRoomCreateArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatRooms.
     * @param {ChatRoomCreateManyArgs} args - Arguments to create many ChatRooms.
     * @example
     * // Create many ChatRooms
     * const chatRoom = await prisma.chatRoom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatRoomCreateManyArgs>(args?: SelectSubset<T, ChatRoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatRooms and returns the data saved in the database.
     * @param {ChatRoomCreateManyAndReturnArgs} args - Arguments to create many ChatRooms.
     * @example
     * // Create many ChatRooms
     * const chatRoom = await prisma.chatRoom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatRooms and only return the `id`
     * const chatRoomWithIdOnly = await prisma.chatRoom.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatRoomCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatRoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatRoom.
     * @param {ChatRoomDeleteArgs} args - Arguments to delete one ChatRoom.
     * @example
     * // Delete one ChatRoom
     * const ChatRoom = await prisma.chatRoom.delete({
     *   where: {
     *     // ... filter to delete one ChatRoom
     *   }
     * })
     * 
     */
    delete<T extends ChatRoomDeleteArgs>(args: SelectSubset<T, ChatRoomDeleteArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatRoom.
     * @param {ChatRoomUpdateArgs} args - Arguments to update one ChatRoom.
     * @example
     * // Update one ChatRoom
     * const chatRoom = await prisma.chatRoom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatRoomUpdateArgs>(args: SelectSubset<T, ChatRoomUpdateArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatRooms.
     * @param {ChatRoomDeleteManyArgs} args - Arguments to filter ChatRooms to delete.
     * @example
     * // Delete a few ChatRooms
     * const { count } = await prisma.chatRoom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatRoomDeleteManyArgs>(args?: SelectSubset<T, ChatRoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatRoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatRooms
     * const chatRoom = await prisma.chatRoom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatRoomUpdateManyArgs>(args: SelectSubset<T, ChatRoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatRooms and returns the data updated in the database.
     * @param {ChatRoomUpdateManyAndReturnArgs} args - Arguments to update many ChatRooms.
     * @example
     * // Update many ChatRooms
     * const chatRoom = await prisma.chatRoom.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatRooms and only return the `id`
     * const chatRoomWithIdOnly = await prisma.chatRoom.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatRoomUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatRoomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatRoom.
     * @param {ChatRoomUpsertArgs} args - Arguments to update or create a ChatRoom.
     * @example
     * // Update or create a ChatRoom
     * const chatRoom = await prisma.chatRoom.upsert({
     *   create: {
     *     // ... data to create a ChatRoom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatRoom we want to update
     *   }
     * })
     */
    upsert<T extends ChatRoomUpsertArgs>(args: SelectSubset<T, ChatRoomUpsertArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatRoomCountArgs} args - Arguments to filter ChatRooms to count.
     * @example
     * // Count the number of ChatRooms
     * const count = await prisma.chatRoom.count({
     *   where: {
     *     // ... the filter for the ChatRooms we want to count
     *   }
     * })
    **/
    count<T extends ChatRoomCountArgs>(
      args?: Subset<T, ChatRoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatRoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatRoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatRoomAggregateArgs>(args: Subset<T, ChatRoomAggregateArgs>): Prisma.PrismaPromise<GetChatRoomAggregateType<T>>

    /**
     * Group by ChatRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatRoomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatRoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatRoomGroupByArgs['orderBy'] }
        : { orderBy?: ChatRoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatRoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatRoom model
   */
  readonly fields: ChatRoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatRoom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatRoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    agent<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends ChatRoom$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatRoom$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatRoom model
   */
  interface ChatRoomFieldRefs {
    readonly id: FieldRef<"ChatRoom", 'String'>
    readonly studentId: FieldRef<"ChatRoom", 'String'>
    readonly agentId: FieldRef<"ChatRoom", 'String'>
    readonly propertyId: FieldRef<"ChatRoom", 'String'>
    readonly createdAt: FieldRef<"ChatRoom", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatRoom findUnique
   */
  export type ChatRoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChatRoom to fetch.
     */
    where: ChatRoomWhereUniqueInput
  }

  /**
   * ChatRoom findUniqueOrThrow
   */
  export type ChatRoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChatRoom to fetch.
     */
    where: ChatRoomWhereUniqueInput
  }

  /**
   * ChatRoom findFirst
   */
  export type ChatRoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChatRoom to fetch.
     */
    where?: ChatRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatRooms to fetch.
     */
    orderBy?: ChatRoomOrderByWithRelationInput | ChatRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatRooms.
     */
    cursor?: ChatRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatRooms.
     */
    distinct?: ChatRoomScalarFieldEnum | ChatRoomScalarFieldEnum[]
  }

  /**
   * ChatRoom findFirstOrThrow
   */
  export type ChatRoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChatRoom to fetch.
     */
    where?: ChatRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatRooms to fetch.
     */
    orderBy?: ChatRoomOrderByWithRelationInput | ChatRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatRooms.
     */
    cursor?: ChatRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatRooms.
     */
    distinct?: ChatRoomScalarFieldEnum | ChatRoomScalarFieldEnum[]
  }

  /**
   * ChatRoom findMany
   */
  export type ChatRoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChatRooms to fetch.
     */
    where?: ChatRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatRooms to fetch.
     */
    orderBy?: ChatRoomOrderByWithRelationInput | ChatRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatRooms.
     */
    cursor?: ChatRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatRooms.
     */
    skip?: number
    distinct?: ChatRoomScalarFieldEnum | ChatRoomScalarFieldEnum[]
  }

  /**
   * ChatRoom create
   */
  export type ChatRoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatRoom.
     */
    data: XOR<ChatRoomCreateInput, ChatRoomUncheckedCreateInput>
  }

  /**
   * ChatRoom createMany
   */
  export type ChatRoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatRooms.
     */
    data: ChatRoomCreateManyInput | ChatRoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatRoom createManyAndReturn
   */
  export type ChatRoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * The data used to create many ChatRooms.
     */
    data: ChatRoomCreateManyInput | ChatRoomCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatRoom update
   */
  export type ChatRoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatRoom.
     */
    data: XOR<ChatRoomUpdateInput, ChatRoomUncheckedUpdateInput>
    /**
     * Choose, which ChatRoom to update.
     */
    where: ChatRoomWhereUniqueInput
  }

  /**
   * ChatRoom updateMany
   */
  export type ChatRoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatRooms.
     */
    data: XOR<ChatRoomUpdateManyMutationInput, ChatRoomUncheckedUpdateManyInput>
    /**
     * Filter which ChatRooms to update
     */
    where?: ChatRoomWhereInput
    /**
     * Limit how many ChatRooms to update.
     */
    limit?: number
  }

  /**
   * ChatRoom updateManyAndReturn
   */
  export type ChatRoomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * The data used to update ChatRooms.
     */
    data: XOR<ChatRoomUpdateManyMutationInput, ChatRoomUncheckedUpdateManyInput>
    /**
     * Filter which ChatRooms to update
     */
    where?: ChatRoomWhereInput
    /**
     * Limit how many ChatRooms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatRoom upsert
   */
  export type ChatRoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatRoom to update in case it exists.
     */
    where: ChatRoomWhereUniqueInput
    /**
     * In case the ChatRoom found by the `where` argument doesn't exist, create a new ChatRoom with this data.
     */
    create: XOR<ChatRoomCreateInput, ChatRoomUncheckedCreateInput>
    /**
     * In case the ChatRoom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatRoomUpdateInput, ChatRoomUncheckedUpdateInput>
  }

  /**
   * ChatRoom delete
   */
  export type ChatRoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
    /**
     * Filter which ChatRoom to delete.
     */
    where: ChatRoomWhereUniqueInput
  }

  /**
   * ChatRoom deleteMany
   */
  export type ChatRoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatRooms to delete
     */
    where?: ChatRoomWhereInput
    /**
     * Limit how many ChatRooms to delete.
     */
    limit?: number
  }

  /**
   * ChatRoom.messages
   */
  export type ChatRoom$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * ChatRoom without action
   */
  export type ChatRoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatRoom
     */
    select?: ChatRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatRoom
     */
    omit?: ChatRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatRoomInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    chatRoomId: string | null
    senderId: string | null
    text: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    chatRoomId: string | null
    senderId: string | null
    text: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    chatRoomId: number
    senderId: number
    text: number
    isRead: number
    createdAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    chatRoomId?: true
    senderId?: true
    text?: true
    isRead?: true
    createdAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    chatRoomId?: true
    senderId?: true
    text?: true
    isRead?: true
    createdAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    chatRoomId?: true
    senderId?: true
    text?: true
    isRead?: true
    createdAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    chatRoomId: string
    senderId: string
    text: string
    isRead: boolean
    createdAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatRoomId?: boolean
    senderId?: boolean
    text?: boolean
    isRead?: boolean
    createdAt?: boolean
    chatRoom?: boolean | ChatRoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatRoomId?: boolean
    senderId?: boolean
    text?: boolean
    isRead?: boolean
    createdAt?: boolean
    chatRoom?: boolean | ChatRoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatRoomId?: boolean
    senderId?: boolean
    text?: boolean
    isRead?: boolean
    createdAt?: boolean
    chatRoom?: boolean | ChatRoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    chatRoomId?: boolean
    senderId?: boolean
    text?: boolean
    isRead?: boolean
    createdAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chatRoomId" | "senderId" | "text" | "isRead" | "createdAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chatRoom?: boolean | ChatRoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chatRoom?: boolean | ChatRoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chatRoom?: boolean | ChatRoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      chatRoom: Prisma.$ChatRoomPayload<ExtArgs>
      sender: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chatRoomId: string
      senderId: string
      text: string
      isRead: boolean
      createdAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chatRoom<T extends ChatRoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatRoomDefaultArgs<ExtArgs>>): Prisma__ChatRoomClient<$Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly chatRoomId: FieldRef<"Message", 'String'>
    readonly senderId: FieldRef<"Message", 'String'>
    readonly text: FieldRef<"Message", 'String'>
    readonly isRead: FieldRef<"Message", 'Boolean'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model OTP
   */

  export type AggregateOTP = {
    _count: OTPCountAggregateOutputType | null
    _min: OTPMinAggregateOutputType | null
    _max: OTPMaxAggregateOutputType | null
  }

  export type OTPMinAggregateOutputType = {
    id: string | null
    email: string | null
    code: string | null
    purpose: $Enums.OTPPurpose | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type OTPMaxAggregateOutputType = {
    id: string | null
    email: string | null
    code: string | null
    purpose: $Enums.OTPPurpose | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type OTPCountAggregateOutputType = {
    id: number
    email: number
    code: number
    purpose: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type OTPMinAggregateInputType = {
    id?: true
    email?: true
    code?: true
    purpose?: true
    expiresAt?: true
    createdAt?: true
  }

  export type OTPMaxAggregateInputType = {
    id?: true
    email?: true
    code?: true
    purpose?: true
    expiresAt?: true
    createdAt?: true
  }

  export type OTPCountAggregateInputType = {
    id?: true
    email?: true
    code?: true
    purpose?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type OTPAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OTP to aggregate.
     */
    where?: OTPWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPS to fetch.
     */
    orderBy?: OTPOrderByWithRelationInput | OTPOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OTPWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OTPS
    **/
    _count?: true | OTPCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OTPMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OTPMaxAggregateInputType
  }

  export type GetOTPAggregateType<T extends OTPAggregateArgs> = {
        [P in keyof T & keyof AggregateOTP]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOTP[P]>
      : GetScalarType<T[P], AggregateOTP[P]>
  }




  export type OTPGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OTPWhereInput
    orderBy?: OTPOrderByWithAggregationInput | OTPOrderByWithAggregationInput[]
    by: OTPScalarFieldEnum[] | OTPScalarFieldEnum
    having?: OTPScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OTPCountAggregateInputType | true
    _min?: OTPMinAggregateInputType
    _max?: OTPMaxAggregateInputType
  }

  export type OTPGroupByOutputType = {
    id: string
    email: string
    code: string
    purpose: $Enums.OTPPurpose
    expiresAt: Date
    createdAt: Date
    _count: OTPCountAggregateOutputType | null
    _min: OTPMinAggregateOutputType | null
    _max: OTPMaxAggregateOutputType | null
  }

  type GetOTPGroupByPayload<T extends OTPGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OTPGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OTPGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OTPGroupByOutputType[P]>
            : GetScalarType<T[P], OTPGroupByOutputType[P]>
        }
      >
    >


  export type OTPSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    code?: boolean
    purpose?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["oTP"]>

  export type OTPSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    code?: boolean
    purpose?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["oTP"]>

  export type OTPSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    code?: boolean
    purpose?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["oTP"]>

  export type OTPSelectScalar = {
    id?: boolean
    email?: boolean
    code?: boolean
    purpose?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type OTPOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "code" | "purpose" | "expiresAt" | "createdAt", ExtArgs["result"]["oTP"]>

  export type $OTPPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OTP"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      code: string
      purpose: $Enums.OTPPurpose
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["oTP"]>
    composites: {}
  }

  type OTPGetPayload<S extends boolean | null | undefined | OTPDefaultArgs> = $Result.GetResult<Prisma.$OTPPayload, S>

  type OTPCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OTPFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OTPCountAggregateInputType | true
    }

  export interface OTPDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OTP'], meta: { name: 'OTP' } }
    /**
     * Find zero or one OTP that matches the filter.
     * @param {OTPFindUniqueArgs} args - Arguments to find a OTP
     * @example
     * // Get one OTP
     * const oTP = await prisma.oTP.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OTPFindUniqueArgs>(args: SelectSubset<T, OTPFindUniqueArgs<ExtArgs>>): Prisma__OTPClient<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OTP that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OTPFindUniqueOrThrowArgs} args - Arguments to find a OTP
     * @example
     * // Get one OTP
     * const oTP = await prisma.oTP.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OTPFindUniqueOrThrowArgs>(args: SelectSubset<T, OTPFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OTPClient<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OTP that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPFindFirstArgs} args - Arguments to find a OTP
     * @example
     * // Get one OTP
     * const oTP = await prisma.oTP.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OTPFindFirstArgs>(args?: SelectSubset<T, OTPFindFirstArgs<ExtArgs>>): Prisma__OTPClient<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OTP that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPFindFirstOrThrowArgs} args - Arguments to find a OTP
     * @example
     * // Get one OTP
     * const oTP = await prisma.oTP.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OTPFindFirstOrThrowArgs>(args?: SelectSubset<T, OTPFindFirstOrThrowArgs<ExtArgs>>): Prisma__OTPClient<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OTPS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OTPS
     * const oTPS = await prisma.oTP.findMany()
     * 
     * // Get first 10 OTPS
     * const oTPS = await prisma.oTP.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oTPWithIdOnly = await prisma.oTP.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OTPFindManyArgs>(args?: SelectSubset<T, OTPFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OTP.
     * @param {OTPCreateArgs} args - Arguments to create a OTP.
     * @example
     * // Create one OTP
     * const OTP = await prisma.oTP.create({
     *   data: {
     *     // ... data to create a OTP
     *   }
     * })
     * 
     */
    create<T extends OTPCreateArgs>(args: SelectSubset<T, OTPCreateArgs<ExtArgs>>): Prisma__OTPClient<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OTPS.
     * @param {OTPCreateManyArgs} args - Arguments to create many OTPS.
     * @example
     * // Create many OTPS
     * const oTP = await prisma.oTP.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OTPCreateManyArgs>(args?: SelectSubset<T, OTPCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OTPS and returns the data saved in the database.
     * @param {OTPCreateManyAndReturnArgs} args - Arguments to create many OTPS.
     * @example
     * // Create many OTPS
     * const oTP = await prisma.oTP.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OTPS and only return the `id`
     * const oTPWithIdOnly = await prisma.oTP.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OTPCreateManyAndReturnArgs>(args?: SelectSubset<T, OTPCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OTP.
     * @param {OTPDeleteArgs} args - Arguments to delete one OTP.
     * @example
     * // Delete one OTP
     * const OTP = await prisma.oTP.delete({
     *   where: {
     *     // ... filter to delete one OTP
     *   }
     * })
     * 
     */
    delete<T extends OTPDeleteArgs>(args: SelectSubset<T, OTPDeleteArgs<ExtArgs>>): Prisma__OTPClient<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OTP.
     * @param {OTPUpdateArgs} args - Arguments to update one OTP.
     * @example
     * // Update one OTP
     * const oTP = await prisma.oTP.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OTPUpdateArgs>(args: SelectSubset<T, OTPUpdateArgs<ExtArgs>>): Prisma__OTPClient<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OTPS.
     * @param {OTPDeleteManyArgs} args - Arguments to filter OTPS to delete.
     * @example
     * // Delete a few OTPS
     * const { count } = await prisma.oTP.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OTPDeleteManyArgs>(args?: SelectSubset<T, OTPDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OTPS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OTPS
     * const oTP = await prisma.oTP.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OTPUpdateManyArgs>(args: SelectSubset<T, OTPUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OTPS and returns the data updated in the database.
     * @param {OTPUpdateManyAndReturnArgs} args - Arguments to update many OTPS.
     * @example
     * // Update many OTPS
     * const oTP = await prisma.oTP.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OTPS and only return the `id`
     * const oTPWithIdOnly = await prisma.oTP.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OTPUpdateManyAndReturnArgs>(args: SelectSubset<T, OTPUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OTP.
     * @param {OTPUpsertArgs} args - Arguments to update or create a OTP.
     * @example
     * // Update or create a OTP
     * const oTP = await prisma.oTP.upsert({
     *   create: {
     *     // ... data to create a OTP
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OTP we want to update
     *   }
     * })
     */
    upsert<T extends OTPUpsertArgs>(args: SelectSubset<T, OTPUpsertArgs<ExtArgs>>): Prisma__OTPClient<$Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OTPS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPCountArgs} args - Arguments to filter OTPS to count.
     * @example
     * // Count the number of OTPS
     * const count = await prisma.oTP.count({
     *   where: {
     *     // ... the filter for the OTPS we want to count
     *   }
     * })
    **/
    count<T extends OTPCountArgs>(
      args?: Subset<T, OTPCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OTPCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OTP.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OTPAggregateArgs>(args: Subset<T, OTPAggregateArgs>): Prisma.PrismaPromise<GetOTPAggregateType<T>>

    /**
     * Group by OTP.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OTPGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OTPGroupByArgs['orderBy'] }
        : { orderBy?: OTPGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OTPGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOTPGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OTP model
   */
  readonly fields: OTPFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OTP.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OTPClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OTP model
   */
  interface OTPFieldRefs {
    readonly id: FieldRef<"OTP", 'String'>
    readonly email: FieldRef<"OTP", 'String'>
    readonly code: FieldRef<"OTP", 'String'>
    readonly purpose: FieldRef<"OTP", 'OTPPurpose'>
    readonly expiresAt: FieldRef<"OTP", 'DateTime'>
    readonly createdAt: FieldRef<"OTP", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OTP findUnique
   */
  export type OTPFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * Filter, which OTP to fetch.
     */
    where: OTPWhereUniqueInput
  }

  /**
   * OTP findUniqueOrThrow
   */
  export type OTPFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * Filter, which OTP to fetch.
     */
    where: OTPWhereUniqueInput
  }

  /**
   * OTP findFirst
   */
  export type OTPFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * Filter, which OTP to fetch.
     */
    where?: OTPWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPS to fetch.
     */
    orderBy?: OTPOrderByWithRelationInput | OTPOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OTPS.
     */
    cursor?: OTPWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OTPS.
     */
    distinct?: OTPScalarFieldEnum | OTPScalarFieldEnum[]
  }

  /**
   * OTP findFirstOrThrow
   */
  export type OTPFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * Filter, which OTP to fetch.
     */
    where?: OTPWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPS to fetch.
     */
    orderBy?: OTPOrderByWithRelationInput | OTPOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OTPS.
     */
    cursor?: OTPWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OTPS.
     */
    distinct?: OTPScalarFieldEnum | OTPScalarFieldEnum[]
  }

  /**
   * OTP findMany
   */
  export type OTPFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * Filter, which OTPS to fetch.
     */
    where?: OTPWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPS to fetch.
     */
    orderBy?: OTPOrderByWithRelationInput | OTPOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OTPS.
     */
    cursor?: OTPWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPS.
     */
    skip?: number
    distinct?: OTPScalarFieldEnum | OTPScalarFieldEnum[]
  }

  /**
   * OTP create
   */
  export type OTPCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * The data needed to create a OTP.
     */
    data: XOR<OTPCreateInput, OTPUncheckedCreateInput>
  }

  /**
   * OTP createMany
   */
  export type OTPCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OTPS.
     */
    data: OTPCreateManyInput | OTPCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OTP createManyAndReturn
   */
  export type OTPCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * The data used to create many OTPS.
     */
    data: OTPCreateManyInput | OTPCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OTP update
   */
  export type OTPUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * The data needed to update a OTP.
     */
    data: XOR<OTPUpdateInput, OTPUncheckedUpdateInput>
    /**
     * Choose, which OTP to update.
     */
    where: OTPWhereUniqueInput
  }

  /**
   * OTP updateMany
   */
  export type OTPUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OTPS.
     */
    data: XOR<OTPUpdateManyMutationInput, OTPUncheckedUpdateManyInput>
    /**
     * Filter which OTPS to update
     */
    where?: OTPWhereInput
    /**
     * Limit how many OTPS to update.
     */
    limit?: number
  }

  /**
   * OTP updateManyAndReturn
   */
  export type OTPUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * The data used to update OTPS.
     */
    data: XOR<OTPUpdateManyMutationInput, OTPUncheckedUpdateManyInput>
    /**
     * Filter which OTPS to update
     */
    where?: OTPWhereInput
    /**
     * Limit how many OTPS to update.
     */
    limit?: number
  }

  /**
   * OTP upsert
   */
  export type OTPUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * The filter to search for the OTP to update in case it exists.
     */
    where: OTPWhereUniqueInput
    /**
     * In case the OTP found by the `where` argument doesn't exist, create a new OTP with this data.
     */
    create: XOR<OTPCreateInput, OTPUncheckedCreateInput>
    /**
     * In case the OTP was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OTPUpdateInput, OTPUncheckedUpdateInput>
  }

  /**
   * OTP delete
   */
  export type OTPDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
    /**
     * Filter which OTP to delete.
     */
    where: OTPWhereUniqueInput
  }

  /**
   * OTP deleteMany
   */
  export type OTPDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OTPS to delete
     */
    where?: OTPWhereInput
    /**
     * Limit how many OTPS to delete.
     */
    limit?: number
  }

  /**
   * OTP without action
   */
  export type OTPDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: OTPSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTP
     */
    omit?: OTPOmit<ExtArgs> | null
  }


  /**
   * Model Report
   */

  export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  export type ReportMinAggregateOutputType = {
    id: string | null
    reporterId: string | null
    propertyId: string | null
    roommateId: string | null
    reason: $Enums.ReportReason | null
    customReason: string | null
    description: string | null
    status: $Enums.ReportStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReportMaxAggregateOutputType = {
    id: string | null
    reporterId: string | null
    propertyId: string | null
    roommateId: string | null
    reason: $Enums.ReportReason | null
    customReason: string | null
    description: string | null
    status: $Enums.ReportStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReportCountAggregateOutputType = {
    id: number
    reporterId: number
    propertyId: number
    roommateId: number
    reason: number
    customReason: number
    description: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReportMinAggregateInputType = {
    id?: true
    reporterId?: true
    propertyId?: true
    roommateId?: true
    reason?: true
    customReason?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReportMaxAggregateInputType = {
    id?: true
    reporterId?: true
    propertyId?: true
    roommateId?: true
    reason?: true
    customReason?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReportCountAggregateInputType = {
    id?: true
    reporterId?: true
    propertyId?: true
    roommateId?: true
    reason?: true
    customReason?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Report to aggregate.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reports
    **/
    _count?: true | ReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportMaxAggregateInputType
  }

  export type GetReportAggregateType<T extends ReportAggregateArgs> = {
        [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReport[P]>
      : GetScalarType<T[P], AggregateReport[P]>
  }




  export type ReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithAggregationInput | ReportOrderByWithAggregationInput[]
    by: ReportScalarFieldEnum[] | ReportScalarFieldEnum
    having?: ReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportCountAggregateInputType | true
    _min?: ReportMinAggregateInputType
    _max?: ReportMaxAggregateInputType
  }

  export type ReportGroupByOutputType = {
    id: string
    reporterId: string
    propertyId: string | null
    roommateId: string | null
    reason: $Enums.ReportReason
    customReason: string | null
    description: string
    status: $Enums.ReportStatus
    createdAt: Date
    updatedAt: Date
    _count: ReportCountAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportGroupByOutputType[P]>
            : GetScalarType<T[P], ReportGroupByOutputType[P]>
        }
      >
    >


  export type ReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterId?: boolean
    propertyId?: boolean
    roommateId?: boolean
    reason?: boolean
    customReason?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reporter?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | Report$propertyArgs<ExtArgs>
    roommate?: boolean | Report$roommateArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>

  export type ReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterId?: boolean
    propertyId?: boolean
    roommateId?: boolean
    reason?: boolean
    customReason?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reporter?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | Report$propertyArgs<ExtArgs>
    roommate?: boolean | Report$roommateArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>

  export type ReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterId?: boolean
    propertyId?: boolean
    roommateId?: boolean
    reason?: boolean
    customReason?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reporter?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | Report$propertyArgs<ExtArgs>
    roommate?: boolean | Report$roommateArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>

  export type ReportSelectScalar = {
    id?: boolean
    reporterId?: boolean
    propertyId?: boolean
    roommateId?: boolean
    reason?: boolean
    customReason?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reporterId" | "propertyId" | "roommateId" | "reason" | "customReason" | "description" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["report"]>
  export type ReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reporter?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | Report$propertyArgs<ExtArgs>
    roommate?: boolean | Report$roommateArgs<ExtArgs>
  }
  export type ReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reporter?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | Report$propertyArgs<ExtArgs>
    roommate?: boolean | Report$roommateArgs<ExtArgs>
  }
  export type ReportIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reporter?: boolean | UserDefaultArgs<ExtArgs>
    property?: boolean | Report$propertyArgs<ExtArgs>
    roommate?: boolean | Report$roommateArgs<ExtArgs>
  }

  export type $ReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Report"
    objects: {
      reporter: Prisma.$UserPayload<ExtArgs>
      property: Prisma.$PropertyPayload<ExtArgs> | null
      roommate: Prisma.$StudentProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reporterId: string
      propertyId: string | null
      roommateId: string | null
      reason: $Enums.ReportReason
      customReason: string | null
      description: string
      status: $Enums.ReportStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["report"]>
    composites: {}
  }

  type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = $Result.GetResult<Prisma.$ReportPayload, S>

  type ReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportCountAggregateInputType | true
    }

  export interface ReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Report'], meta: { name: 'Report' } }
    /**
     * Find zero or one Report that matches the filter.
     * @param {ReportFindUniqueArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportFindUniqueArgs>(args: SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Report that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReportFindUniqueOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportFindFirstArgs>(args?: SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.report.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.report.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportWithIdOnly = await prisma.report.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportFindManyArgs>(args?: SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Report.
     * @param {ReportCreateArgs} args - Arguments to create a Report.
     * @example
     * // Create one Report
     * const Report = await prisma.report.create({
     *   data: {
     *     // ... data to create a Report
     *   }
     * })
     * 
     */
    create<T extends ReportCreateArgs>(args: SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reports.
     * @param {ReportCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportCreateManyArgs>(args?: SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reports and returns the data saved in the database.
     * @param {ReportCreateManyAndReturnArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reports and only return the `id`
     * const reportWithIdOnly = await prisma.report.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReportCreateManyAndReturnArgs>(args?: SelectSubset<T, ReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Report.
     * @param {ReportDeleteArgs} args - Arguments to delete one Report.
     * @example
     * // Delete one Report
     * const Report = await prisma.report.delete({
     *   where: {
     *     // ... filter to delete one Report
     *   }
     * })
     * 
     */
    delete<T extends ReportDeleteArgs>(args: SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Report.
     * @param {ReportUpdateArgs} args - Arguments to update one Report.
     * @example
     * // Update one Report
     * const report = await prisma.report.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportUpdateArgs>(args: SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reports.
     * @param {ReportDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.report.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportDeleteManyArgs>(args?: SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportUpdateManyArgs>(args: SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports and returns the data updated in the database.
     * @param {ReportUpdateManyAndReturnArgs} args - Arguments to update many Reports.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reports and only return the `id`
     * const reportWithIdOnly = await prisma.report.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReportUpdateManyAndReturnArgs>(args: SelectSubset<T, ReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Report.
     * @param {ReportUpsertArgs} args - Arguments to update or create a Report.
     * @example
     * // Update or create a Report
     * const report = await prisma.report.upsert({
     *   create: {
     *     // ... data to create a Report
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Report we want to update
     *   }
     * })
     */
    upsert<T extends ReportUpsertArgs>(args: SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.report.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends ReportCountArgs>(
      args?: Subset<T, ReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportAggregateArgs>(args: Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>

    /**
     * Group by Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportGroupByArgs['orderBy'] }
        : { orderBy?: ReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Report model
   */
  readonly fields: ReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Report.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reporter<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    property<T extends Report$propertyArgs<ExtArgs> = {}>(args?: Subset<T, Report$propertyArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    roommate<T extends Report$roommateArgs<ExtArgs> = {}>(args?: Subset<T, Report$roommateArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Report model
   */
  interface ReportFieldRefs {
    readonly id: FieldRef<"Report", 'String'>
    readonly reporterId: FieldRef<"Report", 'String'>
    readonly propertyId: FieldRef<"Report", 'String'>
    readonly roommateId: FieldRef<"Report", 'String'>
    readonly reason: FieldRef<"Report", 'ReportReason'>
    readonly customReason: FieldRef<"Report", 'String'>
    readonly description: FieldRef<"Report", 'String'>
    readonly status: FieldRef<"Report", 'ReportStatus'>
    readonly createdAt: FieldRef<"Report", 'DateTime'>
    readonly updatedAt: FieldRef<"Report", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Report findUnique
   */
  export type ReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findUniqueOrThrow
   */
  export type ReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findFirst
   */
  export type ReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findFirstOrThrow
   */
  export type ReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findMany
   */
  export type ReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Reports to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report create
   */
  export type ReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to create a Report.
     */
    data: XOR<ReportCreateInput, ReportUncheckedCreateInput>
  }

  /**
   * Report createMany
   */
  export type ReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Report createManyAndReturn
   */
  export type ReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Report update
   */
  export type ReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to update a Report.
     */
    data: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
    /**
     * Choose, which Report to update.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report updateMany
   */
  export type ReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
  }

  /**
   * Report updateManyAndReturn
   */
  export type ReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Report upsert
   */
  export type ReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The filter to search for the Report to update in case it exists.
     */
    where: ReportWhereUniqueInput
    /**
     * In case the Report found by the `where` argument doesn't exist, create a new Report with this data.
     */
    create: XOR<ReportCreateInput, ReportUncheckedCreateInput>
    /**
     * In case the Report was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
  }

  /**
   * Report delete
   */
  export type ReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter which Report to delete.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report deleteMany
   */
  export type ReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reports to delete
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to delete.
     */
    limit?: number
  }

  /**
   * Report.property
   */
  export type Report$propertyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
  }

  /**
   * Report.roommate
   */
  export type Report$roommateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProfile
     */
    omit?: StudentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    where?: StudentProfileWhereInput
  }

  /**
   * Report without action
   */
  export type ReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    phone: 'phone',
    password: 'password',
    role: 'role',
    isEmailVerified: 'isEmailVerified',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const StudentProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    fullName: 'fullName',
    university: 'university',
    username: 'username',
    preferences: 'preferences',
    isVerified: 'isVerified',
    idCardDoc: 'idCardDoc',
    feesReceiptDoc: 'feesReceiptDoc',
    portalScreenshotDoc: 'portalScreenshotDoc',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StudentProfileScalarFieldEnum = (typeof StudentProfileScalarFieldEnum)[keyof typeof StudentProfileScalarFieldEnum]


  export const AgentProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    fullName: 'fullName',
    address: 'address',
    agencyName: 'agencyName',
    bio: 'bio',
    ninDocument: 'ninDocument',
    isVerified: 'isVerified',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AgentProfileScalarFieldEnum = (typeof AgentProfileScalarFieldEnum)[keyof typeof AgentProfileScalarFieldEnum]


  export const PropertyScalarFieldEnum: {
    id: 'id',
    title: 'title',
    hostelType: 'hostelType',
    price: 'price',
    location: 'location',
    distance: 'distance',
    description: 'description',
    amenities: 'amenities',
    images: 'images',
    latitude: 'latitude',
    longitude: 'longitude',
    isAvailable: 'isAvailable',
    isVerified: 'isVerified',
    views: 'views',
    university: 'university',
    isRoommateOption: 'isRoommateOption',
    agentId: 'agentId',
    studentId: 'studentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PropertyScalarFieldEnum = (typeof PropertyScalarFieldEnum)[keyof typeof PropertyScalarFieldEnum]


  export const InquiryScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    propertyId: 'propertyId',
    agentId: 'agentId',
    message: 'message',
    createdAt: 'createdAt'
  };

  export type InquiryScalarFieldEnum = (typeof InquiryScalarFieldEnum)[keyof typeof InquiryScalarFieldEnum]


  export const ViewingScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    propertyId: 'propertyId',
    dateTime: 'dateTime',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ViewingScalarFieldEnum = (typeof ViewingScalarFieldEnum)[keyof typeof ViewingScalarFieldEnum]


  export const ChatRoomScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    agentId: 'agentId',
    propertyId: 'propertyId',
    createdAt: 'createdAt'
  };

  export type ChatRoomScalarFieldEnum = (typeof ChatRoomScalarFieldEnum)[keyof typeof ChatRoomScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    chatRoomId: 'chatRoomId',
    senderId: 'senderId',
    text: 'text',
    isRead: 'isRead',
    createdAt: 'createdAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const OTPScalarFieldEnum: {
    id: 'id',
    email: 'email',
    code: 'code',
    purpose: 'purpose',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type OTPScalarFieldEnum = (typeof OTPScalarFieldEnum)[keyof typeof OTPScalarFieldEnum]


  export const ReportScalarFieldEnum: {
    id: 'id',
    reporterId: 'reporterId',
    propertyId: 'propertyId',
    roommateId: 'roommateId',
    reason: 'reason',
    customReason: 'customReason',
    description: 'description',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'OTPPurpose'
   */
  export type EnumOTPPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OTPPurpose'>
    


  /**
   * Reference to a field of type 'OTPPurpose[]'
   */
  export type ListEnumOTPPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OTPPurpose[]'>
    


  /**
   * Reference to a field of type 'ReportReason'
   */
  export type EnumReportReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportReason'>
    


  /**
   * Reference to a field of type 'ReportReason[]'
   */
  export type ListEnumReportReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportReason[]'>
    


  /**
   * Reference to a field of type 'ReportStatus'
   */
  export type EnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus'>
    


  /**
   * Reference to a field of type 'ReportStatus[]'
   */
  export type ListEnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    isEmailVerified?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    studentProfile?: XOR<StudentProfileNullableScalarRelationFilter, StudentProfileWhereInput> | null
    agentProfile?: XOR<AgentProfileNullableScalarRelationFilter, AgentProfileWhereInput> | null
    inquiries?: InquiryListRelationFilter
    receivedInquiries?: InquiryListRelationFilter
    viewings?: ViewingListRelationFilter
    studentChatRooms?: ChatRoomListRelationFilter
    agentChatRooms?: ChatRoomListRelationFilter
    messagesSent?: MessageListRelationFilter
    reportsSubmitted?: ReportListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    studentProfile?: StudentProfileOrderByWithRelationInput
    agentProfile?: AgentProfileOrderByWithRelationInput
    inquiries?: InquiryOrderByRelationAggregateInput
    receivedInquiries?: InquiryOrderByRelationAggregateInput
    viewings?: ViewingOrderByRelationAggregateInput
    studentChatRooms?: ChatRoomOrderByRelationAggregateInput
    agentChatRooms?: ChatRoomOrderByRelationAggregateInput
    messagesSent?: MessageOrderByRelationAggregateInput
    reportsSubmitted?: ReportOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    phone?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    isEmailVerified?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    studentProfile?: XOR<StudentProfileNullableScalarRelationFilter, StudentProfileWhereInput> | null
    agentProfile?: XOR<AgentProfileNullableScalarRelationFilter, AgentProfileWhereInput> | null
    inquiries?: InquiryListRelationFilter
    receivedInquiries?: InquiryListRelationFilter
    viewings?: ViewingListRelationFilter
    studentChatRooms?: ChatRoomListRelationFilter
    agentChatRooms?: ChatRoomListRelationFilter
    messagesSent?: MessageListRelationFilter
    reportsSubmitted?: ReportListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    isEmailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type StudentProfileWhereInput = {
    AND?: StudentProfileWhereInput | StudentProfileWhereInput[]
    OR?: StudentProfileWhereInput[]
    NOT?: StudentProfileWhereInput | StudentProfileWhereInput[]
    id?: StringFilter<"StudentProfile"> | string
    userId?: StringFilter<"StudentProfile"> | string
    fullName?: StringFilter<"StudentProfile"> | string
    university?: StringFilter<"StudentProfile"> | string
    username?: StringFilter<"StudentProfile"> | string
    preferences?: JsonNullableFilter<"StudentProfile">
    isVerified?: BoolFilter<"StudentProfile"> | boolean
    idCardDoc?: StringNullableFilter<"StudentProfile"> | string | null
    feesReceiptDoc?: StringNullableFilter<"StudentProfile"> | string | null
    portalScreenshotDoc?: StringNullableFilter<"StudentProfile"> | string | null
    createdAt?: DateTimeFilter<"StudentProfile"> | Date | string
    updatedAt?: DateTimeFilter<"StudentProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    properties?: PropertyListRelationFilter
    reports?: ReportListRelationFilter
  }

  export type StudentProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    university?: SortOrder
    username?: SortOrder
    preferences?: SortOrderInput | SortOrder
    isVerified?: SortOrder
    idCardDoc?: SortOrderInput | SortOrder
    feesReceiptDoc?: SortOrderInput | SortOrder
    portalScreenshotDoc?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    properties?: PropertyOrderByRelationAggregateInput
    reports?: ReportOrderByRelationAggregateInput
  }

  export type StudentProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    username?: string
    AND?: StudentProfileWhereInput | StudentProfileWhereInput[]
    OR?: StudentProfileWhereInput[]
    NOT?: StudentProfileWhereInput | StudentProfileWhereInput[]
    fullName?: StringFilter<"StudentProfile"> | string
    university?: StringFilter<"StudentProfile"> | string
    preferences?: JsonNullableFilter<"StudentProfile">
    isVerified?: BoolFilter<"StudentProfile"> | boolean
    idCardDoc?: StringNullableFilter<"StudentProfile"> | string | null
    feesReceiptDoc?: StringNullableFilter<"StudentProfile"> | string | null
    portalScreenshotDoc?: StringNullableFilter<"StudentProfile"> | string | null
    createdAt?: DateTimeFilter<"StudentProfile"> | Date | string
    updatedAt?: DateTimeFilter<"StudentProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    properties?: PropertyListRelationFilter
    reports?: ReportListRelationFilter
  }, "id" | "userId" | "username">

  export type StudentProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    university?: SortOrder
    username?: SortOrder
    preferences?: SortOrderInput | SortOrder
    isVerified?: SortOrder
    idCardDoc?: SortOrderInput | SortOrder
    feesReceiptDoc?: SortOrderInput | SortOrder
    portalScreenshotDoc?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StudentProfileCountOrderByAggregateInput
    _max?: StudentProfileMaxOrderByAggregateInput
    _min?: StudentProfileMinOrderByAggregateInput
  }

  export type StudentProfileScalarWhereWithAggregatesInput = {
    AND?: StudentProfileScalarWhereWithAggregatesInput | StudentProfileScalarWhereWithAggregatesInput[]
    OR?: StudentProfileScalarWhereWithAggregatesInput[]
    NOT?: StudentProfileScalarWhereWithAggregatesInput | StudentProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentProfile"> | string
    userId?: StringWithAggregatesFilter<"StudentProfile"> | string
    fullName?: StringWithAggregatesFilter<"StudentProfile"> | string
    university?: StringWithAggregatesFilter<"StudentProfile"> | string
    username?: StringWithAggregatesFilter<"StudentProfile"> | string
    preferences?: JsonNullableWithAggregatesFilter<"StudentProfile">
    isVerified?: BoolWithAggregatesFilter<"StudentProfile"> | boolean
    idCardDoc?: StringNullableWithAggregatesFilter<"StudentProfile"> | string | null
    feesReceiptDoc?: StringNullableWithAggregatesFilter<"StudentProfile"> | string | null
    portalScreenshotDoc?: StringNullableWithAggregatesFilter<"StudentProfile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StudentProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StudentProfile"> | Date | string
  }

  export type AgentProfileWhereInput = {
    AND?: AgentProfileWhereInput | AgentProfileWhereInput[]
    OR?: AgentProfileWhereInput[]
    NOT?: AgentProfileWhereInput | AgentProfileWhereInput[]
    id?: StringFilter<"AgentProfile"> | string
    userId?: StringFilter<"AgentProfile"> | string
    fullName?: StringFilter<"AgentProfile"> | string
    address?: StringNullableFilter<"AgentProfile"> | string | null
    agencyName?: StringNullableFilter<"AgentProfile"> | string | null
    bio?: StringNullableFilter<"AgentProfile"> | string | null
    ninDocument?: StringNullableFilter<"AgentProfile"> | string | null
    isVerified?: BoolFilter<"AgentProfile"> | boolean
    createdAt?: DateTimeFilter<"AgentProfile"> | Date | string
    updatedAt?: DateTimeFilter<"AgentProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    properties?: PropertyListRelationFilter
  }

  export type AgentProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    address?: SortOrderInput | SortOrder
    agencyName?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    ninDocument?: SortOrderInput | SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    properties?: PropertyOrderByRelationAggregateInput
  }

  export type AgentProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: AgentProfileWhereInput | AgentProfileWhereInput[]
    OR?: AgentProfileWhereInput[]
    NOT?: AgentProfileWhereInput | AgentProfileWhereInput[]
    fullName?: StringFilter<"AgentProfile"> | string
    address?: StringNullableFilter<"AgentProfile"> | string | null
    agencyName?: StringNullableFilter<"AgentProfile"> | string | null
    bio?: StringNullableFilter<"AgentProfile"> | string | null
    ninDocument?: StringNullableFilter<"AgentProfile"> | string | null
    isVerified?: BoolFilter<"AgentProfile"> | boolean
    createdAt?: DateTimeFilter<"AgentProfile"> | Date | string
    updatedAt?: DateTimeFilter<"AgentProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    properties?: PropertyListRelationFilter
  }, "id" | "userId">

  export type AgentProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    address?: SortOrderInput | SortOrder
    agencyName?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    ninDocument?: SortOrderInput | SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AgentProfileCountOrderByAggregateInput
    _max?: AgentProfileMaxOrderByAggregateInput
    _min?: AgentProfileMinOrderByAggregateInput
  }

  export type AgentProfileScalarWhereWithAggregatesInput = {
    AND?: AgentProfileScalarWhereWithAggregatesInput | AgentProfileScalarWhereWithAggregatesInput[]
    OR?: AgentProfileScalarWhereWithAggregatesInput[]
    NOT?: AgentProfileScalarWhereWithAggregatesInput | AgentProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentProfile"> | string
    userId?: StringWithAggregatesFilter<"AgentProfile"> | string
    fullName?: StringWithAggregatesFilter<"AgentProfile"> | string
    address?: StringNullableWithAggregatesFilter<"AgentProfile"> | string | null
    agencyName?: StringNullableWithAggregatesFilter<"AgentProfile"> | string | null
    bio?: StringNullableWithAggregatesFilter<"AgentProfile"> | string | null
    ninDocument?: StringNullableWithAggregatesFilter<"AgentProfile"> | string | null
    isVerified?: BoolWithAggregatesFilter<"AgentProfile"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AgentProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AgentProfile"> | Date | string
  }

  export type PropertyWhereInput = {
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    id?: StringFilter<"Property"> | string
    title?: StringFilter<"Property"> | string
    hostelType?: StringFilter<"Property"> | string
    price?: FloatFilter<"Property"> | number
    location?: StringFilter<"Property"> | string
    distance?: StringFilter<"Property"> | string
    description?: StringFilter<"Property"> | string
    amenities?: StringNullableListFilter<"Property">
    images?: StringNullableListFilter<"Property">
    latitude?: FloatNullableFilter<"Property"> | number | null
    longitude?: FloatNullableFilter<"Property"> | number | null
    isAvailable?: BoolFilter<"Property"> | boolean
    isVerified?: BoolFilter<"Property"> | boolean
    views?: IntFilter<"Property"> | number
    university?: StringFilter<"Property"> | string
    isRoommateOption?: BoolFilter<"Property"> | boolean
    agentId?: StringNullableFilter<"Property"> | string | null
    studentId?: StringNullableFilter<"Property"> | string | null
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    agent?: XOR<AgentProfileNullableScalarRelationFilter, AgentProfileWhereInput> | null
    student?: XOR<StudentProfileNullableScalarRelationFilter, StudentProfileWhereInput> | null
    inquiries?: InquiryListRelationFilter
    viewings?: ViewingListRelationFilter
    chatRooms?: ChatRoomListRelationFilter
    reports?: ReportListRelationFilter
  }

  export type PropertyOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    hostelType?: SortOrder
    price?: SortOrder
    location?: SortOrder
    distance?: SortOrder
    description?: SortOrder
    amenities?: SortOrder
    images?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    isAvailable?: SortOrder
    isVerified?: SortOrder
    views?: SortOrder
    university?: SortOrder
    isRoommateOption?: SortOrder
    agentId?: SortOrderInput | SortOrder
    studentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    agent?: AgentProfileOrderByWithRelationInput
    student?: StudentProfileOrderByWithRelationInput
    inquiries?: InquiryOrderByRelationAggregateInput
    viewings?: ViewingOrderByRelationAggregateInput
    chatRooms?: ChatRoomOrderByRelationAggregateInput
    reports?: ReportOrderByRelationAggregateInput
  }

  export type PropertyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    title?: StringFilter<"Property"> | string
    hostelType?: StringFilter<"Property"> | string
    price?: FloatFilter<"Property"> | number
    location?: StringFilter<"Property"> | string
    distance?: StringFilter<"Property"> | string
    description?: StringFilter<"Property"> | string
    amenities?: StringNullableListFilter<"Property">
    images?: StringNullableListFilter<"Property">
    latitude?: FloatNullableFilter<"Property"> | number | null
    longitude?: FloatNullableFilter<"Property"> | number | null
    isAvailable?: BoolFilter<"Property"> | boolean
    isVerified?: BoolFilter<"Property"> | boolean
    views?: IntFilter<"Property"> | number
    university?: StringFilter<"Property"> | string
    isRoommateOption?: BoolFilter<"Property"> | boolean
    agentId?: StringNullableFilter<"Property"> | string | null
    studentId?: StringNullableFilter<"Property"> | string | null
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    agent?: XOR<AgentProfileNullableScalarRelationFilter, AgentProfileWhereInput> | null
    student?: XOR<StudentProfileNullableScalarRelationFilter, StudentProfileWhereInput> | null
    inquiries?: InquiryListRelationFilter
    viewings?: ViewingListRelationFilter
    chatRooms?: ChatRoomListRelationFilter
    reports?: ReportListRelationFilter
  }, "id">

  export type PropertyOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    hostelType?: SortOrder
    price?: SortOrder
    location?: SortOrder
    distance?: SortOrder
    description?: SortOrder
    amenities?: SortOrder
    images?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    isAvailable?: SortOrder
    isVerified?: SortOrder
    views?: SortOrder
    university?: SortOrder
    isRoommateOption?: SortOrder
    agentId?: SortOrderInput | SortOrder
    studentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PropertyCountOrderByAggregateInput
    _avg?: PropertyAvgOrderByAggregateInput
    _max?: PropertyMaxOrderByAggregateInput
    _min?: PropertyMinOrderByAggregateInput
    _sum?: PropertySumOrderByAggregateInput
  }

  export type PropertyScalarWhereWithAggregatesInput = {
    AND?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    OR?: PropertyScalarWhereWithAggregatesInput[]
    NOT?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Property"> | string
    title?: StringWithAggregatesFilter<"Property"> | string
    hostelType?: StringWithAggregatesFilter<"Property"> | string
    price?: FloatWithAggregatesFilter<"Property"> | number
    location?: StringWithAggregatesFilter<"Property"> | string
    distance?: StringWithAggregatesFilter<"Property"> | string
    description?: StringWithAggregatesFilter<"Property"> | string
    amenities?: StringNullableListFilter<"Property">
    images?: StringNullableListFilter<"Property">
    latitude?: FloatNullableWithAggregatesFilter<"Property"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"Property"> | number | null
    isAvailable?: BoolWithAggregatesFilter<"Property"> | boolean
    isVerified?: BoolWithAggregatesFilter<"Property"> | boolean
    views?: IntWithAggregatesFilter<"Property"> | number
    university?: StringWithAggregatesFilter<"Property"> | string
    isRoommateOption?: BoolWithAggregatesFilter<"Property"> | boolean
    agentId?: StringNullableWithAggregatesFilter<"Property"> | string | null
    studentId?: StringNullableWithAggregatesFilter<"Property"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
  }

  export type InquiryWhereInput = {
    AND?: InquiryWhereInput | InquiryWhereInput[]
    OR?: InquiryWhereInput[]
    NOT?: InquiryWhereInput | InquiryWhereInput[]
    id?: StringFilter<"Inquiry"> | string
    studentId?: StringFilter<"Inquiry"> | string
    propertyId?: StringFilter<"Inquiry"> | string
    agentId?: StringFilter<"Inquiry"> | string
    message?: StringFilter<"Inquiry"> | string
    createdAt?: DateTimeFilter<"Inquiry"> | Date | string
    student?: XOR<UserScalarRelationFilter, UserWhereInput>
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    agent?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type InquiryOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    agentId?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    student?: UserOrderByWithRelationInput
    property?: PropertyOrderByWithRelationInput
    agent?: UserOrderByWithRelationInput
  }

  export type InquiryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InquiryWhereInput | InquiryWhereInput[]
    OR?: InquiryWhereInput[]
    NOT?: InquiryWhereInput | InquiryWhereInput[]
    studentId?: StringFilter<"Inquiry"> | string
    propertyId?: StringFilter<"Inquiry"> | string
    agentId?: StringFilter<"Inquiry"> | string
    message?: StringFilter<"Inquiry"> | string
    createdAt?: DateTimeFilter<"Inquiry"> | Date | string
    student?: XOR<UserScalarRelationFilter, UserWhereInput>
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    agent?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type InquiryOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    agentId?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    _count?: InquiryCountOrderByAggregateInput
    _max?: InquiryMaxOrderByAggregateInput
    _min?: InquiryMinOrderByAggregateInput
  }

  export type InquiryScalarWhereWithAggregatesInput = {
    AND?: InquiryScalarWhereWithAggregatesInput | InquiryScalarWhereWithAggregatesInput[]
    OR?: InquiryScalarWhereWithAggregatesInput[]
    NOT?: InquiryScalarWhereWithAggregatesInput | InquiryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Inquiry"> | string
    studentId?: StringWithAggregatesFilter<"Inquiry"> | string
    propertyId?: StringWithAggregatesFilter<"Inquiry"> | string
    agentId?: StringWithAggregatesFilter<"Inquiry"> | string
    message?: StringWithAggregatesFilter<"Inquiry"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Inquiry"> | Date | string
  }

  export type ViewingWhereInput = {
    AND?: ViewingWhereInput | ViewingWhereInput[]
    OR?: ViewingWhereInput[]
    NOT?: ViewingWhereInput | ViewingWhereInput[]
    id?: StringFilter<"Viewing"> | string
    studentId?: StringFilter<"Viewing"> | string
    propertyId?: StringFilter<"Viewing"> | string
    dateTime?: DateTimeFilter<"Viewing"> | Date | string
    status?: StringFilter<"Viewing"> | string
    createdAt?: DateTimeFilter<"Viewing"> | Date | string
    updatedAt?: DateTimeFilter<"Viewing"> | Date | string
    student?: XOR<UserScalarRelationFilter, UserWhereInput>
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }

  export type ViewingOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    student?: UserOrderByWithRelationInput
    property?: PropertyOrderByWithRelationInput
  }

  export type ViewingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ViewingWhereInput | ViewingWhereInput[]
    OR?: ViewingWhereInput[]
    NOT?: ViewingWhereInput | ViewingWhereInput[]
    studentId?: StringFilter<"Viewing"> | string
    propertyId?: StringFilter<"Viewing"> | string
    dateTime?: DateTimeFilter<"Viewing"> | Date | string
    status?: StringFilter<"Viewing"> | string
    createdAt?: DateTimeFilter<"Viewing"> | Date | string
    updatedAt?: DateTimeFilter<"Viewing"> | Date | string
    student?: XOR<UserScalarRelationFilter, UserWhereInput>
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }, "id">

  export type ViewingOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ViewingCountOrderByAggregateInput
    _max?: ViewingMaxOrderByAggregateInput
    _min?: ViewingMinOrderByAggregateInput
  }

  export type ViewingScalarWhereWithAggregatesInput = {
    AND?: ViewingScalarWhereWithAggregatesInput | ViewingScalarWhereWithAggregatesInput[]
    OR?: ViewingScalarWhereWithAggregatesInput[]
    NOT?: ViewingScalarWhereWithAggregatesInput | ViewingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Viewing"> | string
    studentId?: StringWithAggregatesFilter<"Viewing"> | string
    propertyId?: StringWithAggregatesFilter<"Viewing"> | string
    dateTime?: DateTimeWithAggregatesFilter<"Viewing"> | Date | string
    status?: StringWithAggregatesFilter<"Viewing"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Viewing"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Viewing"> | Date | string
  }

  export type ChatRoomWhereInput = {
    AND?: ChatRoomWhereInput | ChatRoomWhereInput[]
    OR?: ChatRoomWhereInput[]
    NOT?: ChatRoomWhereInput | ChatRoomWhereInput[]
    id?: StringFilter<"ChatRoom"> | string
    studentId?: StringFilter<"ChatRoom"> | string
    agentId?: StringFilter<"ChatRoom"> | string
    propertyId?: StringFilter<"ChatRoom"> | string
    createdAt?: DateTimeFilter<"ChatRoom"> | Date | string
    student?: XOR<UserScalarRelationFilter, UserWhereInput>
    agent?: XOR<UserScalarRelationFilter, UserWhereInput>
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    messages?: MessageListRelationFilter
  }

  export type ChatRoomOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    agentId?: SortOrder
    propertyId?: SortOrder
    createdAt?: SortOrder
    student?: UserOrderByWithRelationInput
    agent?: UserOrderByWithRelationInput
    property?: PropertyOrderByWithRelationInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ChatRoomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    studentId_agentId_propertyId?: ChatRoomStudentIdAgentIdPropertyIdCompoundUniqueInput
    AND?: ChatRoomWhereInput | ChatRoomWhereInput[]
    OR?: ChatRoomWhereInput[]
    NOT?: ChatRoomWhereInput | ChatRoomWhereInput[]
    studentId?: StringFilter<"ChatRoom"> | string
    agentId?: StringFilter<"ChatRoom"> | string
    propertyId?: StringFilter<"ChatRoom"> | string
    createdAt?: DateTimeFilter<"ChatRoom"> | Date | string
    student?: XOR<UserScalarRelationFilter, UserWhereInput>
    agent?: XOR<UserScalarRelationFilter, UserWhereInput>
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    messages?: MessageListRelationFilter
  }, "id" | "studentId_agentId_propertyId">

  export type ChatRoomOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    agentId?: SortOrder
    propertyId?: SortOrder
    createdAt?: SortOrder
    _count?: ChatRoomCountOrderByAggregateInput
    _max?: ChatRoomMaxOrderByAggregateInput
    _min?: ChatRoomMinOrderByAggregateInput
  }

  export type ChatRoomScalarWhereWithAggregatesInput = {
    AND?: ChatRoomScalarWhereWithAggregatesInput | ChatRoomScalarWhereWithAggregatesInput[]
    OR?: ChatRoomScalarWhereWithAggregatesInput[]
    NOT?: ChatRoomScalarWhereWithAggregatesInput | ChatRoomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatRoom"> | string
    studentId?: StringWithAggregatesFilter<"ChatRoom"> | string
    agentId?: StringWithAggregatesFilter<"ChatRoom"> | string
    propertyId?: StringWithAggregatesFilter<"ChatRoom"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatRoom"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    chatRoomId?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    text?: StringFilter<"Message"> | string
    isRead?: BoolFilter<"Message"> | boolean
    createdAt?: DateTimeFilter<"Message"> | Date | string
    chatRoom?: XOR<ChatRoomScalarRelationFilter, ChatRoomWhereInput>
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    chatRoomId?: SortOrder
    senderId?: SortOrder
    text?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    chatRoom?: ChatRoomOrderByWithRelationInput
    sender?: UserOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    chatRoomId?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    text?: StringFilter<"Message"> | string
    isRead?: BoolFilter<"Message"> | boolean
    createdAt?: DateTimeFilter<"Message"> | Date | string
    chatRoom?: XOR<ChatRoomScalarRelationFilter, ChatRoomWhereInput>
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    chatRoomId?: SortOrder
    senderId?: SortOrder
    text?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    chatRoomId?: StringWithAggregatesFilter<"Message"> | string
    senderId?: StringWithAggregatesFilter<"Message"> | string
    text?: StringWithAggregatesFilter<"Message"> | string
    isRead?: BoolWithAggregatesFilter<"Message"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type OTPWhereInput = {
    AND?: OTPWhereInput | OTPWhereInput[]
    OR?: OTPWhereInput[]
    NOT?: OTPWhereInput | OTPWhereInput[]
    id?: StringFilter<"OTP"> | string
    email?: StringFilter<"OTP"> | string
    code?: StringFilter<"OTP"> | string
    purpose?: EnumOTPPurposeFilter<"OTP"> | $Enums.OTPPurpose
    expiresAt?: DateTimeFilter<"OTP"> | Date | string
    createdAt?: DateTimeFilter<"OTP"> | Date | string
  }

  export type OTPOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    purpose?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OTPWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OTPWhereInput | OTPWhereInput[]
    OR?: OTPWhereInput[]
    NOT?: OTPWhereInput | OTPWhereInput[]
    email?: StringFilter<"OTP"> | string
    code?: StringFilter<"OTP"> | string
    purpose?: EnumOTPPurposeFilter<"OTP"> | $Enums.OTPPurpose
    expiresAt?: DateTimeFilter<"OTP"> | Date | string
    createdAt?: DateTimeFilter<"OTP"> | Date | string
  }, "id">

  export type OTPOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    purpose?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: OTPCountOrderByAggregateInput
    _max?: OTPMaxOrderByAggregateInput
    _min?: OTPMinOrderByAggregateInput
  }

  export type OTPScalarWhereWithAggregatesInput = {
    AND?: OTPScalarWhereWithAggregatesInput | OTPScalarWhereWithAggregatesInput[]
    OR?: OTPScalarWhereWithAggregatesInput[]
    NOT?: OTPScalarWhereWithAggregatesInput | OTPScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OTP"> | string
    email?: StringWithAggregatesFilter<"OTP"> | string
    code?: StringWithAggregatesFilter<"OTP"> | string
    purpose?: EnumOTPPurposeWithAggregatesFilter<"OTP"> | $Enums.OTPPurpose
    expiresAt?: DateTimeWithAggregatesFilter<"OTP"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"OTP"> | Date | string
  }

  export type ReportWhereInput = {
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    id?: StringFilter<"Report"> | string
    reporterId?: StringFilter<"Report"> | string
    propertyId?: StringNullableFilter<"Report"> | string | null
    roommateId?: StringNullableFilter<"Report"> | string | null
    reason?: EnumReportReasonFilter<"Report"> | $Enums.ReportReason
    customReason?: StringNullableFilter<"Report"> | string | null
    description?: StringFilter<"Report"> | string
    status?: EnumReportStatusFilter<"Report"> | $Enums.ReportStatus
    createdAt?: DateTimeFilter<"Report"> | Date | string
    updatedAt?: DateTimeFilter<"Report"> | Date | string
    reporter?: XOR<UserScalarRelationFilter, UserWhereInput>
    property?: XOR<PropertyNullableScalarRelationFilter, PropertyWhereInput> | null
    roommate?: XOR<StudentProfileNullableScalarRelationFilter, StudentProfileWhereInput> | null
  }

  export type ReportOrderByWithRelationInput = {
    id?: SortOrder
    reporterId?: SortOrder
    propertyId?: SortOrderInput | SortOrder
    roommateId?: SortOrderInput | SortOrder
    reason?: SortOrder
    customReason?: SortOrderInput | SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reporter?: UserOrderByWithRelationInput
    property?: PropertyOrderByWithRelationInput
    roommate?: StudentProfileOrderByWithRelationInput
  }

  export type ReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    reporterId?: StringFilter<"Report"> | string
    propertyId?: StringNullableFilter<"Report"> | string | null
    roommateId?: StringNullableFilter<"Report"> | string | null
    reason?: EnumReportReasonFilter<"Report"> | $Enums.ReportReason
    customReason?: StringNullableFilter<"Report"> | string | null
    description?: StringFilter<"Report"> | string
    status?: EnumReportStatusFilter<"Report"> | $Enums.ReportStatus
    createdAt?: DateTimeFilter<"Report"> | Date | string
    updatedAt?: DateTimeFilter<"Report"> | Date | string
    reporter?: XOR<UserScalarRelationFilter, UserWhereInput>
    property?: XOR<PropertyNullableScalarRelationFilter, PropertyWhereInput> | null
    roommate?: XOR<StudentProfileNullableScalarRelationFilter, StudentProfileWhereInput> | null
  }, "id">

  export type ReportOrderByWithAggregationInput = {
    id?: SortOrder
    reporterId?: SortOrder
    propertyId?: SortOrderInput | SortOrder
    roommateId?: SortOrderInput | SortOrder
    reason?: SortOrder
    customReason?: SortOrderInput | SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReportCountOrderByAggregateInput
    _max?: ReportMaxOrderByAggregateInput
    _min?: ReportMinOrderByAggregateInput
  }

  export type ReportScalarWhereWithAggregatesInput = {
    AND?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    OR?: ReportScalarWhereWithAggregatesInput[]
    NOT?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Report"> | string
    reporterId?: StringWithAggregatesFilter<"Report"> | string
    propertyId?: StringNullableWithAggregatesFilter<"Report"> | string | null
    roommateId?: StringNullableWithAggregatesFilter<"Report"> | string | null
    reason?: EnumReportReasonWithAggregatesFilter<"Report"> | $Enums.ReportReason
    customReason?: StringNullableWithAggregatesFilter<"Report"> | string | null
    description?: StringWithAggregatesFilter<"Report"> | string
    status?: EnumReportStatusWithAggregatesFilter<"Report"> | $Enums.ReportStatus
    createdAt?: DateTimeWithAggregatesFilter<"Report"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Report"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProfileCreateInput = {
    id?: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    properties?: PropertyCreateNestedManyWithoutStudentInput
    reports?: ReportCreateNestedManyWithoutRoommateInput
  }

  export type StudentProfileUncheckedCreateInput = {
    id?: string
    userId: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyUncheckedCreateNestedManyWithoutStudentInput
    reports?: ReportUncheckedCreateNestedManyWithoutRoommateInput
  }

  export type StudentProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    properties?: PropertyUpdateManyWithoutStudentNestedInput
    reports?: ReportUpdateManyWithoutRoommateNestedInput
  }

  export type StudentProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUncheckedUpdateManyWithoutStudentNestedInput
    reports?: ReportUncheckedUpdateManyWithoutRoommateNestedInput
  }

  export type StudentProfileCreateManyInput = {
    id?: string
    userId: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentProfileCreateInput = {
    id?: string
    fullName: string
    address?: string | null
    agencyName?: string | null
    bio?: string | null
    ninDocument?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAgentProfileInput
    properties?: PropertyCreateNestedManyWithoutAgentInput
  }

  export type AgentProfileUncheckedCreateInput = {
    id?: string
    userId: string
    fullName: string
    address?: string | null
    agencyName?: string | null
    bio?: string | null
    ninDocument?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    agencyName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    ninDocument?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAgentProfileNestedInput
    properties?: PropertyUpdateManyWithoutAgentNestedInput
  }

  export type AgentProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    agencyName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    ninDocument?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type AgentProfileCreateManyInput = {
    id?: string
    userId: string
    fullName: string
    address?: string | null
    agencyName?: string | null
    bio?: string | null
    ninDocument?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    agencyName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    ninDocument?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    agencyName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    ninDocument?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyCreateInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: AgentProfileCreateNestedOneWithoutPropertiesInput
    student?: StudentProfileCreateNestedOneWithoutPropertiesInput
    inquiries?: InquiryCreateNestedManyWithoutPropertyInput
    viewings?: ViewingCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomCreateNestedManyWithoutPropertyInput
    reports?: ReportCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    agentId?: string | null
    studentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inquiries?: InquiryUncheckedCreateNestedManyWithoutPropertyInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomUncheckedCreateNestedManyWithoutPropertyInput
    reports?: ReportUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentProfileUpdateOneWithoutPropertiesNestedInput
    student?: StudentProfileUpdateOneWithoutPropertiesNestedInput
    inquiries?: InquiryUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUpdateManyWithoutPropertyNestedInput
    reports?: ReportUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inquiries?: InquiryUncheckedUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUncheckedUpdateManyWithoutPropertyNestedInput
    reports?: ReportUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyCreateManyInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    agentId?: string | null
    studentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PropertyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryCreateInput = {
    id?: string
    message: string
    createdAt?: Date | string
    student: UserCreateNestedOneWithoutInquiriesInput
    property: PropertyCreateNestedOneWithoutInquiriesInput
    agent: UserCreateNestedOneWithoutReceivedInquiriesInput
  }

  export type InquiryUncheckedCreateInput = {
    id?: string
    studentId: string
    propertyId: string
    agentId: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutInquiriesNestedInput
    property?: PropertyUpdateOneRequiredWithoutInquiriesNestedInput
    agent?: UserUpdateOneRequiredWithoutReceivedInquiriesNestedInput
  }

  export type InquiryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryCreateManyInput = {
    id?: string
    studentId: string
    propertyId: string
    agentId: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViewingCreateInput = {
    id?: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    student: UserCreateNestedOneWithoutViewingsInput
    property: PropertyCreateNestedOneWithoutViewingsInput
  }

  export type ViewingUncheckedCreateInput = {
    id?: string
    studentId: string
    propertyId: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ViewingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutViewingsNestedInput
    property?: PropertyUpdateOneRequiredWithoutViewingsNestedInput
  }

  export type ViewingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViewingCreateManyInput = {
    id?: string
    studentId: string
    propertyId: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ViewingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViewingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatRoomCreateInput = {
    id?: string
    createdAt?: Date | string
    student: UserCreateNestedOneWithoutStudentChatRoomsInput
    agent: UserCreateNestedOneWithoutAgentChatRoomsInput
    property: PropertyCreateNestedOneWithoutChatRoomsInput
    messages?: MessageCreateNestedManyWithoutChatRoomInput
  }

  export type ChatRoomUncheckedCreateInput = {
    id?: string
    studentId: string
    agentId: string
    propertyId: string
    createdAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutChatRoomInput
  }

  export type ChatRoomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutStudentChatRoomsNestedInput
    agent?: UserUpdateOneRequiredWithoutAgentChatRoomsNestedInput
    property?: PropertyUpdateOneRequiredWithoutChatRoomsNestedInput
    messages?: MessageUpdateManyWithoutChatRoomNestedInput
  }

  export type ChatRoomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutChatRoomNestedInput
  }

  export type ChatRoomCreateManyInput = {
    id?: string
    studentId: string
    agentId: string
    propertyId: string
    createdAt?: Date | string
  }

  export type ChatRoomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatRoomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
    chatRoom: ChatRoomCreateNestedOneWithoutMessagesInput
    sender: UserCreateNestedOneWithoutMessagesSentInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    chatRoomId: string
    senderId: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chatRoom?: ChatRoomUpdateOneRequiredWithoutMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutMessagesSentNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatRoomId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    chatRoomId: string
    senderId: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatRoomId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPCreateInput = {
    id?: string
    email: string
    code: string
    purpose: $Enums.OTPPurpose
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type OTPUncheckedCreateInput = {
    id?: string
    email: string
    code: string
    purpose: $Enums.OTPPurpose
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type OTPUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    purpose?: EnumOTPPurposeFieldUpdateOperationsInput | $Enums.OTPPurpose
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    purpose?: EnumOTPPurposeFieldUpdateOperationsInput | $Enums.OTPPurpose
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPCreateManyInput = {
    id?: string
    email: string
    code: string
    purpose: $Enums.OTPPurpose
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type OTPUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    purpose?: EnumOTPPurposeFieldUpdateOperationsInput | $Enums.OTPPurpose
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    purpose?: EnumOTPPurposeFieldUpdateOperationsInput | $Enums.OTPPurpose
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportCreateInput = {
    id?: string
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    reporter: UserCreateNestedOneWithoutReportsSubmittedInput
    property?: PropertyCreateNestedOneWithoutReportsInput
    roommate?: StudentProfileCreateNestedOneWithoutReportsInput
  }

  export type ReportUncheckedCreateInput = {
    id?: string
    reporterId: string
    propertyId?: string | null
    roommateId?: string | null
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reporter?: UserUpdateOneRequiredWithoutReportsSubmittedNestedInput
    property?: PropertyUpdateOneWithoutReportsNestedInput
    roommate?: StudentProfileUpdateOneWithoutReportsNestedInput
  }

  export type ReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    roommateId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportCreateManyInput = {
    id?: string
    reporterId: string
    propertyId?: string | null
    roommateId?: string | null
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    roommateId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StudentProfileNullableScalarRelationFilter = {
    is?: StudentProfileWhereInput | null
    isNot?: StudentProfileWhereInput | null
  }

  export type AgentProfileNullableScalarRelationFilter = {
    is?: AgentProfileWhereInput | null
    isNot?: AgentProfileWhereInput | null
  }

  export type InquiryListRelationFilter = {
    every?: InquiryWhereInput
    some?: InquiryWhereInput
    none?: InquiryWhereInput
  }

  export type ViewingListRelationFilter = {
    every?: ViewingWhereInput
    some?: ViewingWhereInput
    none?: ViewingWhereInput
  }

  export type ChatRoomListRelationFilter = {
    every?: ChatRoomWhereInput
    some?: ChatRoomWhereInput
    none?: ChatRoomWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type ReportListRelationFilter = {
    every?: ReportWhereInput
    some?: ReportWhereInput
    none?: ReportWhereInput
  }

  export type InquiryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ViewingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatRoomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PropertyListRelationFilter = {
    every?: PropertyWhereInput
    some?: PropertyWhereInput
    none?: PropertyWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PropertyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    university?: SortOrder
    username?: SortOrder
    preferences?: SortOrder
    isVerified?: SortOrder
    idCardDoc?: SortOrder
    feesReceiptDoc?: SortOrder
    portalScreenshotDoc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    university?: SortOrder
    username?: SortOrder
    isVerified?: SortOrder
    idCardDoc?: SortOrder
    feesReceiptDoc?: SortOrder
    portalScreenshotDoc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    university?: SortOrder
    username?: SortOrder
    isVerified?: SortOrder
    idCardDoc?: SortOrder
    feesReceiptDoc?: SortOrder
    portalScreenshotDoc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type AgentProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    address?: SortOrder
    agencyName?: SortOrder
    bio?: SortOrder
    ninDocument?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    address?: SortOrder
    agencyName?: SortOrder
    bio?: SortOrder
    ninDocument?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    address?: SortOrder
    agencyName?: SortOrder
    bio?: SortOrder
    ninDocument?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PropertyCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    hostelType?: SortOrder
    price?: SortOrder
    location?: SortOrder
    distance?: SortOrder
    description?: SortOrder
    amenities?: SortOrder
    images?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    isAvailable?: SortOrder
    isVerified?: SortOrder
    views?: SortOrder
    university?: SortOrder
    isRoommateOption?: SortOrder
    agentId?: SortOrder
    studentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertyAvgOrderByAggregateInput = {
    price?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    views?: SortOrder
  }

  export type PropertyMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    hostelType?: SortOrder
    price?: SortOrder
    location?: SortOrder
    distance?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    isAvailable?: SortOrder
    isVerified?: SortOrder
    views?: SortOrder
    university?: SortOrder
    isRoommateOption?: SortOrder
    agentId?: SortOrder
    studentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertyMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    hostelType?: SortOrder
    price?: SortOrder
    location?: SortOrder
    distance?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    isAvailable?: SortOrder
    isVerified?: SortOrder
    views?: SortOrder
    university?: SortOrder
    isRoommateOption?: SortOrder
    agentId?: SortOrder
    studentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertySumOrderByAggregateInput = {
    price?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    views?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type PropertyScalarRelationFilter = {
    is?: PropertyWhereInput
    isNot?: PropertyWhereInput
  }

  export type InquiryCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    agentId?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type InquiryMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    agentId?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type InquiryMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    agentId?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type ViewingCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ViewingMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ViewingMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    propertyId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatRoomStudentIdAgentIdPropertyIdCompoundUniqueInput = {
    studentId: string
    agentId: string
    propertyId: string
  }

  export type ChatRoomCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    agentId?: SortOrder
    propertyId?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatRoomMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    agentId?: SortOrder
    propertyId?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatRoomMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    agentId?: SortOrder
    propertyId?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatRoomScalarRelationFilter = {
    is?: ChatRoomWhereInput
    isNot?: ChatRoomWhereInput
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    chatRoomId?: SortOrder
    senderId?: SortOrder
    text?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    chatRoomId?: SortOrder
    senderId?: SortOrder
    text?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    chatRoomId?: SortOrder
    senderId?: SortOrder
    text?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumOTPPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.OTPPurpose | EnumOTPPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.OTPPurpose[] | ListEnumOTPPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OTPPurpose[] | ListEnumOTPPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumOTPPurposeFilter<$PrismaModel> | $Enums.OTPPurpose
  }

  export type OTPCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    purpose?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OTPMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    purpose?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OTPMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    purpose?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumOTPPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OTPPurpose | EnumOTPPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.OTPPurpose[] | ListEnumOTPPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OTPPurpose[] | ListEnumOTPPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumOTPPurposeWithAggregatesFilter<$PrismaModel> | $Enums.OTPPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOTPPurposeFilter<$PrismaModel>
    _max?: NestedEnumOTPPurposeFilter<$PrismaModel>
  }

  export type EnumReportReasonFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportReason | EnumReportReasonFieldRefInput<$PrismaModel>
    in?: $Enums.ReportReason[] | ListEnumReportReasonFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportReason[] | ListEnumReportReasonFieldRefInput<$PrismaModel>
    not?: NestedEnumReportReasonFilter<$PrismaModel> | $Enums.ReportReason
  }

  export type EnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus
  }

  export type PropertyNullableScalarRelationFilter = {
    is?: PropertyWhereInput | null
    isNot?: PropertyWhereInput | null
  }

  export type ReportCountOrderByAggregateInput = {
    id?: SortOrder
    reporterId?: SortOrder
    propertyId?: SortOrder
    roommateId?: SortOrder
    reason?: SortOrder
    customReason?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReportMaxOrderByAggregateInput = {
    id?: SortOrder
    reporterId?: SortOrder
    propertyId?: SortOrder
    roommateId?: SortOrder
    reason?: SortOrder
    customReason?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReportMinOrderByAggregateInput = {
    id?: SortOrder
    reporterId?: SortOrder
    propertyId?: SortOrder
    roommateId?: SortOrder
    reason?: SortOrder
    customReason?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumReportReasonWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportReason | EnumReportReasonFieldRefInput<$PrismaModel>
    in?: $Enums.ReportReason[] | ListEnumReportReasonFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportReason[] | ListEnumReportReasonFieldRefInput<$PrismaModel>
    not?: NestedEnumReportReasonWithAggregatesFilter<$PrismaModel> | $Enums.ReportReason
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportReasonFilter<$PrismaModel>
    _max?: NestedEnumReportReasonFilter<$PrismaModel>
  }

  export type EnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportStatusFilter<$PrismaModel>
    _max?: NestedEnumReportStatusFilter<$PrismaModel>
  }

  export type StudentProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUserInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type AgentProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<AgentProfileCreateWithoutUserInput, AgentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AgentProfileCreateOrConnectWithoutUserInput
    connect?: AgentProfileWhereUniqueInput
  }

  export type InquiryCreateNestedManyWithoutStudentInput = {
    create?: XOR<InquiryCreateWithoutStudentInput, InquiryUncheckedCreateWithoutStudentInput> | InquiryCreateWithoutStudentInput[] | InquiryUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutStudentInput | InquiryCreateOrConnectWithoutStudentInput[]
    createMany?: InquiryCreateManyStudentInputEnvelope
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
  }

  export type InquiryCreateNestedManyWithoutAgentInput = {
    create?: XOR<InquiryCreateWithoutAgentInput, InquiryUncheckedCreateWithoutAgentInput> | InquiryCreateWithoutAgentInput[] | InquiryUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutAgentInput | InquiryCreateOrConnectWithoutAgentInput[]
    createMany?: InquiryCreateManyAgentInputEnvelope
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
  }

  export type ViewingCreateNestedManyWithoutStudentInput = {
    create?: XOR<ViewingCreateWithoutStudentInput, ViewingUncheckedCreateWithoutStudentInput> | ViewingCreateWithoutStudentInput[] | ViewingUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ViewingCreateOrConnectWithoutStudentInput | ViewingCreateOrConnectWithoutStudentInput[]
    createMany?: ViewingCreateManyStudentInputEnvelope
    connect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
  }

  export type ChatRoomCreateNestedManyWithoutStudentInput = {
    create?: XOR<ChatRoomCreateWithoutStudentInput, ChatRoomUncheckedCreateWithoutStudentInput> | ChatRoomCreateWithoutStudentInput[] | ChatRoomUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutStudentInput | ChatRoomCreateOrConnectWithoutStudentInput[]
    createMany?: ChatRoomCreateManyStudentInputEnvelope
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
  }

  export type ChatRoomCreateNestedManyWithoutAgentInput = {
    create?: XOR<ChatRoomCreateWithoutAgentInput, ChatRoomUncheckedCreateWithoutAgentInput> | ChatRoomCreateWithoutAgentInput[] | ChatRoomUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutAgentInput | ChatRoomCreateOrConnectWithoutAgentInput[]
    createMany?: ChatRoomCreateManyAgentInputEnvelope
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ReportCreateNestedManyWithoutReporterInput = {
    create?: XOR<ReportCreateWithoutReporterInput, ReportUncheckedCreateWithoutReporterInput> | ReportCreateWithoutReporterInput[] | ReportUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutReporterInput | ReportCreateOrConnectWithoutReporterInput[]
    createMany?: ReportCreateManyReporterInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type StudentProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUserInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type AgentProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<AgentProfileCreateWithoutUserInput, AgentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AgentProfileCreateOrConnectWithoutUserInput
    connect?: AgentProfileWhereUniqueInput
  }

  export type InquiryUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<InquiryCreateWithoutStudentInput, InquiryUncheckedCreateWithoutStudentInput> | InquiryCreateWithoutStudentInput[] | InquiryUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutStudentInput | InquiryCreateOrConnectWithoutStudentInput[]
    createMany?: InquiryCreateManyStudentInputEnvelope
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
  }

  export type InquiryUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<InquiryCreateWithoutAgentInput, InquiryUncheckedCreateWithoutAgentInput> | InquiryCreateWithoutAgentInput[] | InquiryUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutAgentInput | InquiryCreateOrConnectWithoutAgentInput[]
    createMany?: InquiryCreateManyAgentInputEnvelope
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
  }

  export type ViewingUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<ViewingCreateWithoutStudentInput, ViewingUncheckedCreateWithoutStudentInput> | ViewingCreateWithoutStudentInput[] | ViewingUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ViewingCreateOrConnectWithoutStudentInput | ViewingCreateOrConnectWithoutStudentInput[]
    createMany?: ViewingCreateManyStudentInputEnvelope
    connect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
  }

  export type ChatRoomUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<ChatRoomCreateWithoutStudentInput, ChatRoomUncheckedCreateWithoutStudentInput> | ChatRoomCreateWithoutStudentInput[] | ChatRoomUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutStudentInput | ChatRoomCreateOrConnectWithoutStudentInput[]
    createMany?: ChatRoomCreateManyStudentInputEnvelope
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
  }

  export type ChatRoomUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<ChatRoomCreateWithoutAgentInput, ChatRoomUncheckedCreateWithoutAgentInput> | ChatRoomCreateWithoutAgentInput[] | ChatRoomUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutAgentInput | ChatRoomCreateOrConnectWithoutAgentInput[]
    createMany?: ChatRoomCreateManyAgentInputEnvelope
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ReportUncheckedCreateNestedManyWithoutReporterInput = {
    create?: XOR<ReportCreateWithoutReporterInput, ReportUncheckedCreateWithoutReporterInput> | ReportCreateWithoutReporterInput[] | ReportUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutReporterInput | ReportCreateOrConnectWithoutReporterInput[]
    createMany?: ReportCreateManyReporterInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StudentProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUserInput
    upsert?: StudentProfileUpsertWithoutUserInput
    disconnect?: StudentProfileWhereInput | boolean
    delete?: StudentProfileWhereInput | boolean
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutUserInput, StudentProfileUpdateWithoutUserInput>, StudentProfileUncheckedUpdateWithoutUserInput>
  }

  export type AgentProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<AgentProfileCreateWithoutUserInput, AgentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AgentProfileCreateOrConnectWithoutUserInput
    upsert?: AgentProfileUpsertWithoutUserInput
    disconnect?: AgentProfileWhereInput | boolean
    delete?: AgentProfileWhereInput | boolean
    connect?: AgentProfileWhereUniqueInput
    update?: XOR<XOR<AgentProfileUpdateToOneWithWhereWithoutUserInput, AgentProfileUpdateWithoutUserInput>, AgentProfileUncheckedUpdateWithoutUserInput>
  }

  export type InquiryUpdateManyWithoutStudentNestedInput = {
    create?: XOR<InquiryCreateWithoutStudentInput, InquiryUncheckedCreateWithoutStudentInput> | InquiryCreateWithoutStudentInput[] | InquiryUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutStudentInput | InquiryCreateOrConnectWithoutStudentInput[]
    upsert?: InquiryUpsertWithWhereUniqueWithoutStudentInput | InquiryUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: InquiryCreateManyStudentInputEnvelope
    set?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    disconnect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    delete?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    update?: InquiryUpdateWithWhereUniqueWithoutStudentInput | InquiryUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: InquiryUpdateManyWithWhereWithoutStudentInput | InquiryUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: InquiryScalarWhereInput | InquiryScalarWhereInput[]
  }

  export type InquiryUpdateManyWithoutAgentNestedInput = {
    create?: XOR<InquiryCreateWithoutAgentInput, InquiryUncheckedCreateWithoutAgentInput> | InquiryCreateWithoutAgentInput[] | InquiryUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutAgentInput | InquiryCreateOrConnectWithoutAgentInput[]
    upsert?: InquiryUpsertWithWhereUniqueWithoutAgentInput | InquiryUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: InquiryCreateManyAgentInputEnvelope
    set?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    disconnect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    delete?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    update?: InquiryUpdateWithWhereUniqueWithoutAgentInput | InquiryUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: InquiryUpdateManyWithWhereWithoutAgentInput | InquiryUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: InquiryScalarWhereInput | InquiryScalarWhereInput[]
  }

  export type ViewingUpdateManyWithoutStudentNestedInput = {
    create?: XOR<ViewingCreateWithoutStudentInput, ViewingUncheckedCreateWithoutStudentInput> | ViewingCreateWithoutStudentInput[] | ViewingUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ViewingCreateOrConnectWithoutStudentInput | ViewingCreateOrConnectWithoutStudentInput[]
    upsert?: ViewingUpsertWithWhereUniqueWithoutStudentInput | ViewingUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: ViewingCreateManyStudentInputEnvelope
    set?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    disconnect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    delete?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    connect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    update?: ViewingUpdateWithWhereUniqueWithoutStudentInput | ViewingUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: ViewingUpdateManyWithWhereWithoutStudentInput | ViewingUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: ViewingScalarWhereInput | ViewingScalarWhereInput[]
  }

  export type ChatRoomUpdateManyWithoutStudentNestedInput = {
    create?: XOR<ChatRoomCreateWithoutStudentInput, ChatRoomUncheckedCreateWithoutStudentInput> | ChatRoomCreateWithoutStudentInput[] | ChatRoomUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutStudentInput | ChatRoomCreateOrConnectWithoutStudentInput[]
    upsert?: ChatRoomUpsertWithWhereUniqueWithoutStudentInput | ChatRoomUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: ChatRoomCreateManyStudentInputEnvelope
    set?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    disconnect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    delete?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    update?: ChatRoomUpdateWithWhereUniqueWithoutStudentInput | ChatRoomUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: ChatRoomUpdateManyWithWhereWithoutStudentInput | ChatRoomUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: ChatRoomScalarWhereInput | ChatRoomScalarWhereInput[]
  }

  export type ChatRoomUpdateManyWithoutAgentNestedInput = {
    create?: XOR<ChatRoomCreateWithoutAgentInput, ChatRoomUncheckedCreateWithoutAgentInput> | ChatRoomCreateWithoutAgentInput[] | ChatRoomUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutAgentInput | ChatRoomCreateOrConnectWithoutAgentInput[]
    upsert?: ChatRoomUpsertWithWhereUniqueWithoutAgentInput | ChatRoomUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: ChatRoomCreateManyAgentInputEnvelope
    set?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    disconnect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    delete?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    update?: ChatRoomUpdateWithWhereUniqueWithoutAgentInput | ChatRoomUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: ChatRoomUpdateManyWithWhereWithoutAgentInput | ChatRoomUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: ChatRoomScalarWhereInput | ChatRoomScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ReportUpdateManyWithoutReporterNestedInput = {
    create?: XOR<ReportCreateWithoutReporterInput, ReportUncheckedCreateWithoutReporterInput> | ReportCreateWithoutReporterInput[] | ReportUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutReporterInput | ReportCreateOrConnectWithoutReporterInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutReporterInput | ReportUpsertWithWhereUniqueWithoutReporterInput[]
    createMany?: ReportCreateManyReporterInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutReporterInput | ReportUpdateWithWhereUniqueWithoutReporterInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutReporterInput | ReportUpdateManyWithWhereWithoutReporterInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type StudentProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUserInput
    upsert?: StudentProfileUpsertWithoutUserInput
    disconnect?: StudentProfileWhereInput | boolean
    delete?: StudentProfileWhereInput | boolean
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutUserInput, StudentProfileUpdateWithoutUserInput>, StudentProfileUncheckedUpdateWithoutUserInput>
  }

  export type AgentProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<AgentProfileCreateWithoutUserInput, AgentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AgentProfileCreateOrConnectWithoutUserInput
    upsert?: AgentProfileUpsertWithoutUserInput
    disconnect?: AgentProfileWhereInput | boolean
    delete?: AgentProfileWhereInput | boolean
    connect?: AgentProfileWhereUniqueInput
    update?: XOR<XOR<AgentProfileUpdateToOneWithWhereWithoutUserInput, AgentProfileUpdateWithoutUserInput>, AgentProfileUncheckedUpdateWithoutUserInput>
  }

  export type InquiryUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<InquiryCreateWithoutStudentInput, InquiryUncheckedCreateWithoutStudentInput> | InquiryCreateWithoutStudentInput[] | InquiryUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutStudentInput | InquiryCreateOrConnectWithoutStudentInput[]
    upsert?: InquiryUpsertWithWhereUniqueWithoutStudentInput | InquiryUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: InquiryCreateManyStudentInputEnvelope
    set?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    disconnect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    delete?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    update?: InquiryUpdateWithWhereUniqueWithoutStudentInput | InquiryUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: InquiryUpdateManyWithWhereWithoutStudentInput | InquiryUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: InquiryScalarWhereInput | InquiryScalarWhereInput[]
  }

  export type InquiryUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<InquiryCreateWithoutAgentInput, InquiryUncheckedCreateWithoutAgentInput> | InquiryCreateWithoutAgentInput[] | InquiryUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutAgentInput | InquiryCreateOrConnectWithoutAgentInput[]
    upsert?: InquiryUpsertWithWhereUniqueWithoutAgentInput | InquiryUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: InquiryCreateManyAgentInputEnvelope
    set?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    disconnect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    delete?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    update?: InquiryUpdateWithWhereUniqueWithoutAgentInput | InquiryUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: InquiryUpdateManyWithWhereWithoutAgentInput | InquiryUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: InquiryScalarWhereInput | InquiryScalarWhereInput[]
  }

  export type ViewingUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<ViewingCreateWithoutStudentInput, ViewingUncheckedCreateWithoutStudentInput> | ViewingCreateWithoutStudentInput[] | ViewingUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ViewingCreateOrConnectWithoutStudentInput | ViewingCreateOrConnectWithoutStudentInput[]
    upsert?: ViewingUpsertWithWhereUniqueWithoutStudentInput | ViewingUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: ViewingCreateManyStudentInputEnvelope
    set?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    disconnect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    delete?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    connect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    update?: ViewingUpdateWithWhereUniqueWithoutStudentInput | ViewingUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: ViewingUpdateManyWithWhereWithoutStudentInput | ViewingUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: ViewingScalarWhereInput | ViewingScalarWhereInput[]
  }

  export type ChatRoomUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<ChatRoomCreateWithoutStudentInput, ChatRoomUncheckedCreateWithoutStudentInput> | ChatRoomCreateWithoutStudentInput[] | ChatRoomUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutStudentInput | ChatRoomCreateOrConnectWithoutStudentInput[]
    upsert?: ChatRoomUpsertWithWhereUniqueWithoutStudentInput | ChatRoomUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: ChatRoomCreateManyStudentInputEnvelope
    set?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    disconnect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    delete?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    update?: ChatRoomUpdateWithWhereUniqueWithoutStudentInput | ChatRoomUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: ChatRoomUpdateManyWithWhereWithoutStudentInput | ChatRoomUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: ChatRoomScalarWhereInput | ChatRoomScalarWhereInput[]
  }

  export type ChatRoomUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<ChatRoomCreateWithoutAgentInput, ChatRoomUncheckedCreateWithoutAgentInput> | ChatRoomCreateWithoutAgentInput[] | ChatRoomUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutAgentInput | ChatRoomCreateOrConnectWithoutAgentInput[]
    upsert?: ChatRoomUpsertWithWhereUniqueWithoutAgentInput | ChatRoomUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: ChatRoomCreateManyAgentInputEnvelope
    set?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    disconnect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    delete?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    update?: ChatRoomUpdateWithWhereUniqueWithoutAgentInput | ChatRoomUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: ChatRoomUpdateManyWithWhereWithoutAgentInput | ChatRoomUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: ChatRoomScalarWhereInput | ChatRoomScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ReportUncheckedUpdateManyWithoutReporterNestedInput = {
    create?: XOR<ReportCreateWithoutReporterInput, ReportUncheckedCreateWithoutReporterInput> | ReportCreateWithoutReporterInput[] | ReportUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutReporterInput | ReportCreateOrConnectWithoutReporterInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutReporterInput | ReportUpsertWithWhereUniqueWithoutReporterInput[]
    createMany?: ReportCreateManyReporterInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutReporterInput | ReportUpdateWithWhereUniqueWithoutReporterInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutReporterInput | ReportUpdateManyWithWhereWithoutReporterInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutStudentProfileInput = {
    create?: XOR<UserCreateWithoutStudentProfileInput, UserUncheckedCreateWithoutStudentProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentProfileInput
    connect?: UserWhereUniqueInput
  }

  export type PropertyCreateNestedManyWithoutStudentInput = {
    create?: XOR<PropertyCreateWithoutStudentInput, PropertyUncheckedCreateWithoutStudentInput> | PropertyCreateWithoutStudentInput[] | PropertyUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutStudentInput | PropertyCreateOrConnectWithoutStudentInput[]
    createMany?: PropertyCreateManyStudentInputEnvelope
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type ReportCreateNestedManyWithoutRoommateInput = {
    create?: XOR<ReportCreateWithoutRoommateInput, ReportUncheckedCreateWithoutRoommateInput> | ReportCreateWithoutRoommateInput[] | ReportUncheckedCreateWithoutRoommateInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutRoommateInput | ReportCreateOrConnectWithoutRoommateInput[]
    createMany?: ReportCreateManyRoommateInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type PropertyUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<PropertyCreateWithoutStudentInput, PropertyUncheckedCreateWithoutStudentInput> | PropertyCreateWithoutStudentInput[] | PropertyUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutStudentInput | PropertyCreateOrConnectWithoutStudentInput[]
    createMany?: PropertyCreateManyStudentInputEnvelope
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type ReportUncheckedCreateNestedManyWithoutRoommateInput = {
    create?: XOR<ReportCreateWithoutRoommateInput, ReportUncheckedCreateWithoutRoommateInput> | ReportCreateWithoutRoommateInput[] | ReportUncheckedCreateWithoutRoommateInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutRoommateInput | ReportCreateOrConnectWithoutRoommateInput[]
    createMany?: ReportCreateManyRoommateInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutStudentProfileNestedInput = {
    create?: XOR<UserCreateWithoutStudentProfileInput, UserUncheckedCreateWithoutStudentProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentProfileInput
    upsert?: UserUpsertWithoutStudentProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStudentProfileInput, UserUpdateWithoutStudentProfileInput>, UserUncheckedUpdateWithoutStudentProfileInput>
  }

  export type PropertyUpdateManyWithoutStudentNestedInput = {
    create?: XOR<PropertyCreateWithoutStudentInput, PropertyUncheckedCreateWithoutStudentInput> | PropertyCreateWithoutStudentInput[] | PropertyUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutStudentInput | PropertyCreateOrConnectWithoutStudentInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutStudentInput | PropertyUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: PropertyCreateManyStudentInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutStudentInput | PropertyUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutStudentInput | PropertyUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type ReportUpdateManyWithoutRoommateNestedInput = {
    create?: XOR<ReportCreateWithoutRoommateInput, ReportUncheckedCreateWithoutRoommateInput> | ReportCreateWithoutRoommateInput[] | ReportUncheckedCreateWithoutRoommateInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutRoommateInput | ReportCreateOrConnectWithoutRoommateInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutRoommateInput | ReportUpsertWithWhereUniqueWithoutRoommateInput[]
    createMany?: ReportCreateManyRoommateInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutRoommateInput | ReportUpdateWithWhereUniqueWithoutRoommateInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutRoommateInput | ReportUpdateManyWithWhereWithoutRoommateInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type PropertyUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<PropertyCreateWithoutStudentInput, PropertyUncheckedCreateWithoutStudentInput> | PropertyCreateWithoutStudentInput[] | PropertyUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutStudentInput | PropertyCreateOrConnectWithoutStudentInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutStudentInput | PropertyUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: PropertyCreateManyStudentInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutStudentInput | PropertyUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutStudentInput | PropertyUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type ReportUncheckedUpdateManyWithoutRoommateNestedInput = {
    create?: XOR<ReportCreateWithoutRoommateInput, ReportUncheckedCreateWithoutRoommateInput> | ReportCreateWithoutRoommateInput[] | ReportUncheckedCreateWithoutRoommateInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutRoommateInput | ReportCreateOrConnectWithoutRoommateInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutRoommateInput | ReportUpsertWithWhereUniqueWithoutRoommateInput[]
    createMany?: ReportCreateManyRoommateInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutRoommateInput | ReportUpdateWithWhereUniqueWithoutRoommateInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutRoommateInput | ReportUpdateManyWithWhereWithoutRoommateInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAgentProfileInput = {
    create?: XOR<UserCreateWithoutAgentProfileInput, UserUncheckedCreateWithoutAgentProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutAgentProfileInput
    connect?: UserWhereUniqueInput
  }

  export type PropertyCreateNestedManyWithoutAgentInput = {
    create?: XOR<PropertyCreateWithoutAgentInput, PropertyUncheckedCreateWithoutAgentInput> | PropertyCreateWithoutAgentInput[] | PropertyUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutAgentInput | PropertyCreateOrConnectWithoutAgentInput[]
    createMany?: PropertyCreateManyAgentInputEnvelope
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type PropertyUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<PropertyCreateWithoutAgentInput, PropertyUncheckedCreateWithoutAgentInput> | PropertyCreateWithoutAgentInput[] | PropertyUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutAgentInput | PropertyCreateOrConnectWithoutAgentInput[]
    createMany?: PropertyCreateManyAgentInputEnvelope
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutAgentProfileNestedInput = {
    create?: XOR<UserCreateWithoutAgentProfileInput, UserUncheckedCreateWithoutAgentProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutAgentProfileInput
    upsert?: UserUpsertWithoutAgentProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAgentProfileInput, UserUpdateWithoutAgentProfileInput>, UserUncheckedUpdateWithoutAgentProfileInput>
  }

  export type PropertyUpdateManyWithoutAgentNestedInput = {
    create?: XOR<PropertyCreateWithoutAgentInput, PropertyUncheckedCreateWithoutAgentInput> | PropertyCreateWithoutAgentInput[] | PropertyUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutAgentInput | PropertyCreateOrConnectWithoutAgentInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutAgentInput | PropertyUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: PropertyCreateManyAgentInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutAgentInput | PropertyUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutAgentInput | PropertyUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type PropertyUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<PropertyCreateWithoutAgentInput, PropertyUncheckedCreateWithoutAgentInput> | PropertyCreateWithoutAgentInput[] | PropertyUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutAgentInput | PropertyCreateOrConnectWithoutAgentInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutAgentInput | PropertyUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: PropertyCreateManyAgentInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutAgentInput | PropertyUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutAgentInput | PropertyUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type PropertyCreateamenitiesInput = {
    set: string[]
  }

  export type PropertyCreateimagesInput = {
    set: string[]
  }

  export type AgentProfileCreateNestedOneWithoutPropertiesInput = {
    create?: XOR<AgentProfileCreateWithoutPropertiesInput, AgentProfileUncheckedCreateWithoutPropertiesInput>
    connectOrCreate?: AgentProfileCreateOrConnectWithoutPropertiesInput
    connect?: AgentProfileWhereUniqueInput
  }

  export type StudentProfileCreateNestedOneWithoutPropertiesInput = {
    create?: XOR<StudentProfileCreateWithoutPropertiesInput, StudentProfileUncheckedCreateWithoutPropertiesInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutPropertiesInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type InquiryCreateNestedManyWithoutPropertyInput = {
    create?: XOR<InquiryCreateWithoutPropertyInput, InquiryUncheckedCreateWithoutPropertyInput> | InquiryCreateWithoutPropertyInput[] | InquiryUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutPropertyInput | InquiryCreateOrConnectWithoutPropertyInput[]
    createMany?: InquiryCreateManyPropertyInputEnvelope
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
  }

  export type ViewingCreateNestedManyWithoutPropertyInput = {
    create?: XOR<ViewingCreateWithoutPropertyInput, ViewingUncheckedCreateWithoutPropertyInput> | ViewingCreateWithoutPropertyInput[] | ViewingUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ViewingCreateOrConnectWithoutPropertyInput | ViewingCreateOrConnectWithoutPropertyInput[]
    createMany?: ViewingCreateManyPropertyInputEnvelope
    connect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
  }

  export type ChatRoomCreateNestedManyWithoutPropertyInput = {
    create?: XOR<ChatRoomCreateWithoutPropertyInput, ChatRoomUncheckedCreateWithoutPropertyInput> | ChatRoomCreateWithoutPropertyInput[] | ChatRoomUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutPropertyInput | ChatRoomCreateOrConnectWithoutPropertyInput[]
    createMany?: ChatRoomCreateManyPropertyInputEnvelope
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
  }

  export type ReportCreateNestedManyWithoutPropertyInput = {
    create?: XOR<ReportCreateWithoutPropertyInput, ReportUncheckedCreateWithoutPropertyInput> | ReportCreateWithoutPropertyInput[] | ReportUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutPropertyInput | ReportCreateOrConnectWithoutPropertyInput[]
    createMany?: ReportCreateManyPropertyInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type InquiryUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<InquiryCreateWithoutPropertyInput, InquiryUncheckedCreateWithoutPropertyInput> | InquiryCreateWithoutPropertyInput[] | InquiryUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutPropertyInput | InquiryCreateOrConnectWithoutPropertyInput[]
    createMany?: InquiryCreateManyPropertyInputEnvelope
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
  }

  export type ViewingUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<ViewingCreateWithoutPropertyInput, ViewingUncheckedCreateWithoutPropertyInput> | ViewingCreateWithoutPropertyInput[] | ViewingUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ViewingCreateOrConnectWithoutPropertyInput | ViewingCreateOrConnectWithoutPropertyInput[]
    createMany?: ViewingCreateManyPropertyInputEnvelope
    connect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
  }

  export type ChatRoomUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<ChatRoomCreateWithoutPropertyInput, ChatRoomUncheckedCreateWithoutPropertyInput> | ChatRoomCreateWithoutPropertyInput[] | ChatRoomUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutPropertyInput | ChatRoomCreateOrConnectWithoutPropertyInput[]
    createMany?: ChatRoomCreateManyPropertyInputEnvelope
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
  }

  export type ReportUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<ReportCreateWithoutPropertyInput, ReportUncheckedCreateWithoutPropertyInput> | ReportCreateWithoutPropertyInput[] | ReportUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutPropertyInput | ReportCreateOrConnectWithoutPropertyInput[]
    createMany?: ReportCreateManyPropertyInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PropertyUpdateamenitiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PropertyUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AgentProfileUpdateOneWithoutPropertiesNestedInput = {
    create?: XOR<AgentProfileCreateWithoutPropertiesInput, AgentProfileUncheckedCreateWithoutPropertiesInput>
    connectOrCreate?: AgentProfileCreateOrConnectWithoutPropertiesInput
    upsert?: AgentProfileUpsertWithoutPropertiesInput
    disconnect?: AgentProfileWhereInput | boolean
    delete?: AgentProfileWhereInput | boolean
    connect?: AgentProfileWhereUniqueInput
    update?: XOR<XOR<AgentProfileUpdateToOneWithWhereWithoutPropertiesInput, AgentProfileUpdateWithoutPropertiesInput>, AgentProfileUncheckedUpdateWithoutPropertiesInput>
  }

  export type StudentProfileUpdateOneWithoutPropertiesNestedInput = {
    create?: XOR<StudentProfileCreateWithoutPropertiesInput, StudentProfileUncheckedCreateWithoutPropertiesInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutPropertiesInput
    upsert?: StudentProfileUpsertWithoutPropertiesInput
    disconnect?: StudentProfileWhereInput | boolean
    delete?: StudentProfileWhereInput | boolean
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutPropertiesInput, StudentProfileUpdateWithoutPropertiesInput>, StudentProfileUncheckedUpdateWithoutPropertiesInput>
  }

  export type InquiryUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<InquiryCreateWithoutPropertyInput, InquiryUncheckedCreateWithoutPropertyInput> | InquiryCreateWithoutPropertyInput[] | InquiryUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutPropertyInput | InquiryCreateOrConnectWithoutPropertyInput[]
    upsert?: InquiryUpsertWithWhereUniqueWithoutPropertyInput | InquiryUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: InquiryCreateManyPropertyInputEnvelope
    set?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    disconnect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    delete?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    update?: InquiryUpdateWithWhereUniqueWithoutPropertyInput | InquiryUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: InquiryUpdateManyWithWhereWithoutPropertyInput | InquiryUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: InquiryScalarWhereInput | InquiryScalarWhereInput[]
  }

  export type ViewingUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<ViewingCreateWithoutPropertyInput, ViewingUncheckedCreateWithoutPropertyInput> | ViewingCreateWithoutPropertyInput[] | ViewingUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ViewingCreateOrConnectWithoutPropertyInput | ViewingCreateOrConnectWithoutPropertyInput[]
    upsert?: ViewingUpsertWithWhereUniqueWithoutPropertyInput | ViewingUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: ViewingCreateManyPropertyInputEnvelope
    set?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    disconnect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    delete?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    connect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    update?: ViewingUpdateWithWhereUniqueWithoutPropertyInput | ViewingUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: ViewingUpdateManyWithWhereWithoutPropertyInput | ViewingUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: ViewingScalarWhereInput | ViewingScalarWhereInput[]
  }

  export type ChatRoomUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<ChatRoomCreateWithoutPropertyInput, ChatRoomUncheckedCreateWithoutPropertyInput> | ChatRoomCreateWithoutPropertyInput[] | ChatRoomUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutPropertyInput | ChatRoomCreateOrConnectWithoutPropertyInput[]
    upsert?: ChatRoomUpsertWithWhereUniqueWithoutPropertyInput | ChatRoomUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: ChatRoomCreateManyPropertyInputEnvelope
    set?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    disconnect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    delete?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    update?: ChatRoomUpdateWithWhereUniqueWithoutPropertyInput | ChatRoomUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: ChatRoomUpdateManyWithWhereWithoutPropertyInput | ChatRoomUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: ChatRoomScalarWhereInput | ChatRoomScalarWhereInput[]
  }

  export type ReportUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<ReportCreateWithoutPropertyInput, ReportUncheckedCreateWithoutPropertyInput> | ReportCreateWithoutPropertyInput[] | ReportUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutPropertyInput | ReportCreateOrConnectWithoutPropertyInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutPropertyInput | ReportUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: ReportCreateManyPropertyInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutPropertyInput | ReportUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutPropertyInput | ReportUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type InquiryUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<InquiryCreateWithoutPropertyInput, InquiryUncheckedCreateWithoutPropertyInput> | InquiryCreateWithoutPropertyInput[] | InquiryUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: InquiryCreateOrConnectWithoutPropertyInput | InquiryCreateOrConnectWithoutPropertyInput[]
    upsert?: InquiryUpsertWithWhereUniqueWithoutPropertyInput | InquiryUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: InquiryCreateManyPropertyInputEnvelope
    set?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    disconnect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    delete?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    connect?: InquiryWhereUniqueInput | InquiryWhereUniqueInput[]
    update?: InquiryUpdateWithWhereUniqueWithoutPropertyInput | InquiryUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: InquiryUpdateManyWithWhereWithoutPropertyInput | InquiryUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: InquiryScalarWhereInput | InquiryScalarWhereInput[]
  }

  export type ViewingUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<ViewingCreateWithoutPropertyInput, ViewingUncheckedCreateWithoutPropertyInput> | ViewingCreateWithoutPropertyInput[] | ViewingUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ViewingCreateOrConnectWithoutPropertyInput | ViewingCreateOrConnectWithoutPropertyInput[]
    upsert?: ViewingUpsertWithWhereUniqueWithoutPropertyInput | ViewingUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: ViewingCreateManyPropertyInputEnvelope
    set?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    disconnect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    delete?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    connect?: ViewingWhereUniqueInput | ViewingWhereUniqueInput[]
    update?: ViewingUpdateWithWhereUniqueWithoutPropertyInput | ViewingUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: ViewingUpdateManyWithWhereWithoutPropertyInput | ViewingUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: ViewingScalarWhereInput | ViewingScalarWhereInput[]
  }

  export type ChatRoomUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<ChatRoomCreateWithoutPropertyInput, ChatRoomUncheckedCreateWithoutPropertyInput> | ChatRoomCreateWithoutPropertyInput[] | ChatRoomUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ChatRoomCreateOrConnectWithoutPropertyInput | ChatRoomCreateOrConnectWithoutPropertyInput[]
    upsert?: ChatRoomUpsertWithWhereUniqueWithoutPropertyInput | ChatRoomUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: ChatRoomCreateManyPropertyInputEnvelope
    set?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    disconnect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    delete?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    connect?: ChatRoomWhereUniqueInput | ChatRoomWhereUniqueInput[]
    update?: ChatRoomUpdateWithWhereUniqueWithoutPropertyInput | ChatRoomUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: ChatRoomUpdateManyWithWhereWithoutPropertyInput | ChatRoomUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: ChatRoomScalarWhereInput | ChatRoomScalarWhereInput[]
  }

  export type ReportUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<ReportCreateWithoutPropertyInput, ReportUncheckedCreateWithoutPropertyInput> | ReportCreateWithoutPropertyInput[] | ReportUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutPropertyInput | ReportCreateOrConnectWithoutPropertyInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutPropertyInput | ReportUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: ReportCreateManyPropertyInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutPropertyInput | ReportUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutPropertyInput | ReportUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutInquiriesInput = {
    create?: XOR<UserCreateWithoutInquiriesInput, UserUncheckedCreateWithoutInquiriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutInquiriesInput
    connect?: UserWhereUniqueInput
  }

  export type PropertyCreateNestedOneWithoutInquiriesInput = {
    create?: XOR<PropertyCreateWithoutInquiriesInput, PropertyUncheckedCreateWithoutInquiriesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutInquiriesInput
    connect?: PropertyWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedInquiriesInput = {
    create?: XOR<UserCreateWithoutReceivedInquiriesInput, UserUncheckedCreateWithoutReceivedInquiriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedInquiriesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutInquiriesNestedInput = {
    create?: XOR<UserCreateWithoutInquiriesInput, UserUncheckedCreateWithoutInquiriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutInquiriesInput
    upsert?: UserUpsertWithoutInquiriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInquiriesInput, UserUpdateWithoutInquiriesInput>, UserUncheckedUpdateWithoutInquiriesInput>
  }

  export type PropertyUpdateOneRequiredWithoutInquiriesNestedInput = {
    create?: XOR<PropertyCreateWithoutInquiriesInput, PropertyUncheckedCreateWithoutInquiriesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutInquiriesInput
    upsert?: PropertyUpsertWithoutInquiriesInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutInquiriesInput, PropertyUpdateWithoutInquiriesInput>, PropertyUncheckedUpdateWithoutInquiriesInput>
  }

  export type UserUpdateOneRequiredWithoutReceivedInquiriesNestedInput = {
    create?: XOR<UserCreateWithoutReceivedInquiriesInput, UserUncheckedCreateWithoutReceivedInquiriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedInquiriesInput
    upsert?: UserUpsertWithoutReceivedInquiriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedInquiriesInput, UserUpdateWithoutReceivedInquiriesInput>, UserUncheckedUpdateWithoutReceivedInquiriesInput>
  }

  export type UserCreateNestedOneWithoutViewingsInput = {
    create?: XOR<UserCreateWithoutViewingsInput, UserUncheckedCreateWithoutViewingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutViewingsInput
    connect?: UserWhereUniqueInput
  }

  export type PropertyCreateNestedOneWithoutViewingsInput = {
    create?: XOR<PropertyCreateWithoutViewingsInput, PropertyUncheckedCreateWithoutViewingsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutViewingsInput
    connect?: PropertyWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutViewingsNestedInput = {
    create?: XOR<UserCreateWithoutViewingsInput, UserUncheckedCreateWithoutViewingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutViewingsInput
    upsert?: UserUpsertWithoutViewingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutViewingsInput, UserUpdateWithoutViewingsInput>, UserUncheckedUpdateWithoutViewingsInput>
  }

  export type PropertyUpdateOneRequiredWithoutViewingsNestedInput = {
    create?: XOR<PropertyCreateWithoutViewingsInput, PropertyUncheckedCreateWithoutViewingsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutViewingsInput
    upsert?: PropertyUpsertWithoutViewingsInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutViewingsInput, PropertyUpdateWithoutViewingsInput>, PropertyUncheckedUpdateWithoutViewingsInput>
  }

  export type UserCreateNestedOneWithoutStudentChatRoomsInput = {
    create?: XOR<UserCreateWithoutStudentChatRoomsInput, UserUncheckedCreateWithoutStudentChatRoomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentChatRoomsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAgentChatRoomsInput = {
    create?: XOR<UserCreateWithoutAgentChatRoomsInput, UserUncheckedCreateWithoutAgentChatRoomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAgentChatRoomsInput
    connect?: UserWhereUniqueInput
  }

  export type PropertyCreateNestedOneWithoutChatRoomsInput = {
    create?: XOR<PropertyCreateWithoutChatRoomsInput, PropertyUncheckedCreateWithoutChatRoomsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutChatRoomsInput
    connect?: PropertyWhereUniqueInput
  }

  export type MessageCreateNestedManyWithoutChatRoomInput = {
    create?: XOR<MessageCreateWithoutChatRoomInput, MessageUncheckedCreateWithoutChatRoomInput> | MessageCreateWithoutChatRoomInput[] | MessageUncheckedCreateWithoutChatRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutChatRoomInput | MessageCreateOrConnectWithoutChatRoomInput[]
    createMany?: MessageCreateManyChatRoomInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutChatRoomInput = {
    create?: XOR<MessageCreateWithoutChatRoomInput, MessageUncheckedCreateWithoutChatRoomInput> | MessageCreateWithoutChatRoomInput[] | MessageUncheckedCreateWithoutChatRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutChatRoomInput | MessageCreateOrConnectWithoutChatRoomInput[]
    createMany?: MessageCreateManyChatRoomInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutStudentChatRoomsNestedInput = {
    create?: XOR<UserCreateWithoutStudentChatRoomsInput, UserUncheckedCreateWithoutStudentChatRoomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentChatRoomsInput
    upsert?: UserUpsertWithoutStudentChatRoomsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStudentChatRoomsInput, UserUpdateWithoutStudentChatRoomsInput>, UserUncheckedUpdateWithoutStudentChatRoomsInput>
  }

  export type UserUpdateOneRequiredWithoutAgentChatRoomsNestedInput = {
    create?: XOR<UserCreateWithoutAgentChatRoomsInput, UserUncheckedCreateWithoutAgentChatRoomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAgentChatRoomsInput
    upsert?: UserUpsertWithoutAgentChatRoomsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAgentChatRoomsInput, UserUpdateWithoutAgentChatRoomsInput>, UserUncheckedUpdateWithoutAgentChatRoomsInput>
  }

  export type PropertyUpdateOneRequiredWithoutChatRoomsNestedInput = {
    create?: XOR<PropertyCreateWithoutChatRoomsInput, PropertyUncheckedCreateWithoutChatRoomsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutChatRoomsInput
    upsert?: PropertyUpsertWithoutChatRoomsInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutChatRoomsInput, PropertyUpdateWithoutChatRoomsInput>, PropertyUncheckedUpdateWithoutChatRoomsInput>
  }

  export type MessageUpdateManyWithoutChatRoomNestedInput = {
    create?: XOR<MessageCreateWithoutChatRoomInput, MessageUncheckedCreateWithoutChatRoomInput> | MessageCreateWithoutChatRoomInput[] | MessageUncheckedCreateWithoutChatRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutChatRoomInput | MessageCreateOrConnectWithoutChatRoomInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutChatRoomInput | MessageUpsertWithWhereUniqueWithoutChatRoomInput[]
    createMany?: MessageCreateManyChatRoomInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutChatRoomInput | MessageUpdateWithWhereUniqueWithoutChatRoomInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutChatRoomInput | MessageUpdateManyWithWhereWithoutChatRoomInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutChatRoomNestedInput = {
    create?: XOR<MessageCreateWithoutChatRoomInput, MessageUncheckedCreateWithoutChatRoomInput> | MessageCreateWithoutChatRoomInput[] | MessageUncheckedCreateWithoutChatRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutChatRoomInput | MessageCreateOrConnectWithoutChatRoomInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutChatRoomInput | MessageUpsertWithWhereUniqueWithoutChatRoomInput[]
    createMany?: MessageCreateManyChatRoomInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutChatRoomInput | MessageUpdateWithWhereUniqueWithoutChatRoomInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutChatRoomInput | MessageUpdateManyWithWhereWithoutChatRoomInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ChatRoomCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatRoomCreateWithoutMessagesInput, ChatRoomUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatRoomCreateOrConnectWithoutMessagesInput
    connect?: ChatRoomWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMessagesSentInput = {
    create?: XOR<UserCreateWithoutMessagesSentInput, UserUncheckedCreateWithoutMessagesSentInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesSentInput
    connect?: UserWhereUniqueInput
  }

  export type ChatRoomUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatRoomCreateWithoutMessagesInput, ChatRoomUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatRoomCreateOrConnectWithoutMessagesInput
    upsert?: ChatRoomUpsertWithoutMessagesInput
    connect?: ChatRoomWhereUniqueInput
    update?: XOR<XOR<ChatRoomUpdateToOneWithWhereWithoutMessagesInput, ChatRoomUpdateWithoutMessagesInput>, ChatRoomUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateOneRequiredWithoutMessagesSentNestedInput = {
    create?: XOR<UserCreateWithoutMessagesSentInput, UserUncheckedCreateWithoutMessagesSentInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesSentInput
    upsert?: UserUpsertWithoutMessagesSentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMessagesSentInput, UserUpdateWithoutMessagesSentInput>, UserUncheckedUpdateWithoutMessagesSentInput>
  }

  export type EnumOTPPurposeFieldUpdateOperationsInput = {
    set?: $Enums.OTPPurpose
  }

  export type UserCreateNestedOneWithoutReportsSubmittedInput = {
    create?: XOR<UserCreateWithoutReportsSubmittedInput, UserUncheckedCreateWithoutReportsSubmittedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReportsSubmittedInput
    connect?: UserWhereUniqueInput
  }

  export type PropertyCreateNestedOneWithoutReportsInput = {
    create?: XOR<PropertyCreateWithoutReportsInput, PropertyUncheckedCreateWithoutReportsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutReportsInput
    connect?: PropertyWhereUniqueInput
  }

  export type StudentProfileCreateNestedOneWithoutReportsInput = {
    create?: XOR<StudentProfileCreateWithoutReportsInput, StudentProfileUncheckedCreateWithoutReportsInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutReportsInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type EnumReportReasonFieldUpdateOperationsInput = {
    set?: $Enums.ReportReason
  }

  export type EnumReportStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReportStatus
  }

  export type UserUpdateOneRequiredWithoutReportsSubmittedNestedInput = {
    create?: XOR<UserCreateWithoutReportsSubmittedInput, UserUncheckedCreateWithoutReportsSubmittedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReportsSubmittedInput
    upsert?: UserUpsertWithoutReportsSubmittedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReportsSubmittedInput, UserUpdateWithoutReportsSubmittedInput>, UserUncheckedUpdateWithoutReportsSubmittedInput>
  }

  export type PropertyUpdateOneWithoutReportsNestedInput = {
    create?: XOR<PropertyCreateWithoutReportsInput, PropertyUncheckedCreateWithoutReportsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutReportsInput
    upsert?: PropertyUpsertWithoutReportsInput
    disconnect?: PropertyWhereInput | boolean
    delete?: PropertyWhereInput | boolean
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutReportsInput, PropertyUpdateWithoutReportsInput>, PropertyUncheckedUpdateWithoutReportsInput>
  }

  export type StudentProfileUpdateOneWithoutReportsNestedInput = {
    create?: XOR<StudentProfileCreateWithoutReportsInput, StudentProfileUncheckedCreateWithoutReportsInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutReportsInput
    upsert?: StudentProfileUpsertWithoutReportsInput
    disconnect?: StudentProfileWhereInput | boolean
    delete?: StudentProfileWhereInput | boolean
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutReportsInput, StudentProfileUpdateWithoutReportsInput>, StudentProfileUncheckedUpdateWithoutReportsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumOTPPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.OTPPurpose | EnumOTPPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.OTPPurpose[] | ListEnumOTPPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OTPPurpose[] | ListEnumOTPPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumOTPPurposeFilter<$PrismaModel> | $Enums.OTPPurpose
  }

  export type NestedEnumOTPPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OTPPurpose | EnumOTPPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.OTPPurpose[] | ListEnumOTPPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OTPPurpose[] | ListEnumOTPPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumOTPPurposeWithAggregatesFilter<$PrismaModel> | $Enums.OTPPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOTPPurposeFilter<$PrismaModel>
    _max?: NestedEnumOTPPurposeFilter<$PrismaModel>
  }

  export type NestedEnumReportReasonFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportReason | EnumReportReasonFieldRefInput<$PrismaModel>
    in?: $Enums.ReportReason[] | ListEnumReportReasonFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportReason[] | ListEnumReportReasonFieldRefInput<$PrismaModel>
    not?: NestedEnumReportReasonFilter<$PrismaModel> | $Enums.ReportReason
  }

  export type NestedEnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus
  }

  export type NestedEnumReportReasonWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportReason | EnumReportReasonFieldRefInput<$PrismaModel>
    in?: $Enums.ReportReason[] | ListEnumReportReasonFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportReason[] | ListEnumReportReasonFieldRefInput<$PrismaModel>
    not?: NestedEnumReportReasonWithAggregatesFilter<$PrismaModel> | $Enums.ReportReason
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportReasonFilter<$PrismaModel>
    _max?: NestedEnumReportReasonFilter<$PrismaModel>
  }

  export type NestedEnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportStatusFilter<$PrismaModel>
    _max?: NestedEnumReportStatusFilter<$PrismaModel>
  }

  export type StudentProfileCreateWithoutUserInput = {
    id?: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyCreateNestedManyWithoutStudentInput
    reports?: ReportCreateNestedManyWithoutRoommateInput
  }

  export type StudentProfileUncheckedCreateWithoutUserInput = {
    id?: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyUncheckedCreateNestedManyWithoutStudentInput
    reports?: ReportUncheckedCreateNestedManyWithoutRoommateInput
  }

  export type StudentProfileCreateOrConnectWithoutUserInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
  }

  export type AgentProfileCreateWithoutUserInput = {
    id?: string
    fullName: string
    address?: string | null
    agencyName?: string | null
    bio?: string | null
    ninDocument?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyCreateNestedManyWithoutAgentInput
  }

  export type AgentProfileUncheckedCreateWithoutUserInput = {
    id?: string
    fullName: string
    address?: string | null
    agencyName?: string | null
    bio?: string | null
    ninDocument?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentProfileCreateOrConnectWithoutUserInput = {
    where: AgentProfileWhereUniqueInput
    create: XOR<AgentProfileCreateWithoutUserInput, AgentProfileUncheckedCreateWithoutUserInput>
  }

  export type InquiryCreateWithoutStudentInput = {
    id?: string
    message: string
    createdAt?: Date | string
    property: PropertyCreateNestedOneWithoutInquiriesInput
    agent: UserCreateNestedOneWithoutReceivedInquiriesInput
  }

  export type InquiryUncheckedCreateWithoutStudentInput = {
    id?: string
    propertyId: string
    agentId: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryCreateOrConnectWithoutStudentInput = {
    where: InquiryWhereUniqueInput
    create: XOR<InquiryCreateWithoutStudentInput, InquiryUncheckedCreateWithoutStudentInput>
  }

  export type InquiryCreateManyStudentInputEnvelope = {
    data: InquiryCreateManyStudentInput | InquiryCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type InquiryCreateWithoutAgentInput = {
    id?: string
    message: string
    createdAt?: Date | string
    student: UserCreateNestedOneWithoutInquiriesInput
    property: PropertyCreateNestedOneWithoutInquiriesInput
  }

  export type InquiryUncheckedCreateWithoutAgentInput = {
    id?: string
    studentId: string
    propertyId: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryCreateOrConnectWithoutAgentInput = {
    where: InquiryWhereUniqueInput
    create: XOR<InquiryCreateWithoutAgentInput, InquiryUncheckedCreateWithoutAgentInput>
  }

  export type InquiryCreateManyAgentInputEnvelope = {
    data: InquiryCreateManyAgentInput | InquiryCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type ViewingCreateWithoutStudentInput = {
    id?: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutViewingsInput
  }

  export type ViewingUncheckedCreateWithoutStudentInput = {
    id?: string
    propertyId: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ViewingCreateOrConnectWithoutStudentInput = {
    where: ViewingWhereUniqueInput
    create: XOR<ViewingCreateWithoutStudentInput, ViewingUncheckedCreateWithoutStudentInput>
  }

  export type ViewingCreateManyStudentInputEnvelope = {
    data: ViewingCreateManyStudentInput | ViewingCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type ChatRoomCreateWithoutStudentInput = {
    id?: string
    createdAt?: Date | string
    agent: UserCreateNestedOneWithoutAgentChatRoomsInput
    property: PropertyCreateNestedOneWithoutChatRoomsInput
    messages?: MessageCreateNestedManyWithoutChatRoomInput
  }

  export type ChatRoomUncheckedCreateWithoutStudentInput = {
    id?: string
    agentId: string
    propertyId: string
    createdAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutChatRoomInput
  }

  export type ChatRoomCreateOrConnectWithoutStudentInput = {
    where: ChatRoomWhereUniqueInput
    create: XOR<ChatRoomCreateWithoutStudentInput, ChatRoomUncheckedCreateWithoutStudentInput>
  }

  export type ChatRoomCreateManyStudentInputEnvelope = {
    data: ChatRoomCreateManyStudentInput | ChatRoomCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type ChatRoomCreateWithoutAgentInput = {
    id?: string
    createdAt?: Date | string
    student: UserCreateNestedOneWithoutStudentChatRoomsInput
    property: PropertyCreateNestedOneWithoutChatRoomsInput
    messages?: MessageCreateNestedManyWithoutChatRoomInput
  }

  export type ChatRoomUncheckedCreateWithoutAgentInput = {
    id?: string
    studentId: string
    propertyId: string
    createdAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutChatRoomInput
  }

  export type ChatRoomCreateOrConnectWithoutAgentInput = {
    where: ChatRoomWhereUniqueInput
    create: XOR<ChatRoomCreateWithoutAgentInput, ChatRoomUncheckedCreateWithoutAgentInput>
  }

  export type ChatRoomCreateManyAgentInputEnvelope = {
    data: ChatRoomCreateManyAgentInput | ChatRoomCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutSenderInput = {
    id?: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
    chatRoom: ChatRoomCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string
    chatRoomId: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type ReportCreateWithoutReporterInput = {
    id?: string
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    property?: PropertyCreateNestedOneWithoutReportsInput
    roommate?: StudentProfileCreateNestedOneWithoutReportsInput
  }

  export type ReportUncheckedCreateWithoutReporterInput = {
    id?: string
    propertyId?: string | null
    roommateId?: string | null
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReportCreateOrConnectWithoutReporterInput = {
    where: ReportWhereUniqueInput
    create: XOR<ReportCreateWithoutReporterInput, ReportUncheckedCreateWithoutReporterInput>
  }

  export type ReportCreateManyReporterInputEnvelope = {
    data: ReportCreateManyReporterInput | ReportCreateManyReporterInput[]
    skipDuplicates?: boolean
  }

  export type StudentProfileUpsertWithoutUserInput = {
    update: XOR<StudentProfileUpdateWithoutUserInput, StudentProfileUncheckedUpdateWithoutUserInput>
    create: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutUserInput, StudentProfileUncheckedUpdateWithoutUserInput>
  }

  export type StudentProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUpdateManyWithoutStudentNestedInput
    reports?: ReportUpdateManyWithoutRoommateNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUncheckedUpdateManyWithoutStudentNestedInput
    reports?: ReportUncheckedUpdateManyWithoutRoommateNestedInput
  }

  export type AgentProfileUpsertWithoutUserInput = {
    update: XOR<AgentProfileUpdateWithoutUserInput, AgentProfileUncheckedUpdateWithoutUserInput>
    create: XOR<AgentProfileCreateWithoutUserInput, AgentProfileUncheckedCreateWithoutUserInput>
    where?: AgentProfileWhereInput
  }

  export type AgentProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: AgentProfileWhereInput
    data: XOR<AgentProfileUpdateWithoutUserInput, AgentProfileUncheckedUpdateWithoutUserInput>
  }

  export type AgentProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    agencyName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    ninDocument?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUpdateManyWithoutAgentNestedInput
  }

  export type AgentProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    agencyName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    ninDocument?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type InquiryUpsertWithWhereUniqueWithoutStudentInput = {
    where: InquiryWhereUniqueInput
    update: XOR<InquiryUpdateWithoutStudentInput, InquiryUncheckedUpdateWithoutStudentInput>
    create: XOR<InquiryCreateWithoutStudentInput, InquiryUncheckedCreateWithoutStudentInput>
  }

  export type InquiryUpdateWithWhereUniqueWithoutStudentInput = {
    where: InquiryWhereUniqueInput
    data: XOR<InquiryUpdateWithoutStudentInput, InquiryUncheckedUpdateWithoutStudentInput>
  }

  export type InquiryUpdateManyWithWhereWithoutStudentInput = {
    where: InquiryScalarWhereInput
    data: XOR<InquiryUpdateManyMutationInput, InquiryUncheckedUpdateManyWithoutStudentInput>
  }

  export type InquiryScalarWhereInput = {
    AND?: InquiryScalarWhereInput | InquiryScalarWhereInput[]
    OR?: InquiryScalarWhereInput[]
    NOT?: InquiryScalarWhereInput | InquiryScalarWhereInput[]
    id?: StringFilter<"Inquiry"> | string
    studentId?: StringFilter<"Inquiry"> | string
    propertyId?: StringFilter<"Inquiry"> | string
    agentId?: StringFilter<"Inquiry"> | string
    message?: StringFilter<"Inquiry"> | string
    createdAt?: DateTimeFilter<"Inquiry"> | Date | string
  }

  export type InquiryUpsertWithWhereUniqueWithoutAgentInput = {
    where: InquiryWhereUniqueInput
    update: XOR<InquiryUpdateWithoutAgentInput, InquiryUncheckedUpdateWithoutAgentInput>
    create: XOR<InquiryCreateWithoutAgentInput, InquiryUncheckedCreateWithoutAgentInput>
  }

  export type InquiryUpdateWithWhereUniqueWithoutAgentInput = {
    where: InquiryWhereUniqueInput
    data: XOR<InquiryUpdateWithoutAgentInput, InquiryUncheckedUpdateWithoutAgentInput>
  }

  export type InquiryUpdateManyWithWhereWithoutAgentInput = {
    where: InquiryScalarWhereInput
    data: XOR<InquiryUpdateManyMutationInput, InquiryUncheckedUpdateManyWithoutAgentInput>
  }

  export type ViewingUpsertWithWhereUniqueWithoutStudentInput = {
    where: ViewingWhereUniqueInput
    update: XOR<ViewingUpdateWithoutStudentInput, ViewingUncheckedUpdateWithoutStudentInput>
    create: XOR<ViewingCreateWithoutStudentInput, ViewingUncheckedCreateWithoutStudentInput>
  }

  export type ViewingUpdateWithWhereUniqueWithoutStudentInput = {
    where: ViewingWhereUniqueInput
    data: XOR<ViewingUpdateWithoutStudentInput, ViewingUncheckedUpdateWithoutStudentInput>
  }

  export type ViewingUpdateManyWithWhereWithoutStudentInput = {
    where: ViewingScalarWhereInput
    data: XOR<ViewingUpdateManyMutationInput, ViewingUncheckedUpdateManyWithoutStudentInput>
  }

  export type ViewingScalarWhereInput = {
    AND?: ViewingScalarWhereInput | ViewingScalarWhereInput[]
    OR?: ViewingScalarWhereInput[]
    NOT?: ViewingScalarWhereInput | ViewingScalarWhereInput[]
    id?: StringFilter<"Viewing"> | string
    studentId?: StringFilter<"Viewing"> | string
    propertyId?: StringFilter<"Viewing"> | string
    dateTime?: DateTimeFilter<"Viewing"> | Date | string
    status?: StringFilter<"Viewing"> | string
    createdAt?: DateTimeFilter<"Viewing"> | Date | string
    updatedAt?: DateTimeFilter<"Viewing"> | Date | string
  }

  export type ChatRoomUpsertWithWhereUniqueWithoutStudentInput = {
    where: ChatRoomWhereUniqueInput
    update: XOR<ChatRoomUpdateWithoutStudentInput, ChatRoomUncheckedUpdateWithoutStudentInput>
    create: XOR<ChatRoomCreateWithoutStudentInput, ChatRoomUncheckedCreateWithoutStudentInput>
  }

  export type ChatRoomUpdateWithWhereUniqueWithoutStudentInput = {
    where: ChatRoomWhereUniqueInput
    data: XOR<ChatRoomUpdateWithoutStudentInput, ChatRoomUncheckedUpdateWithoutStudentInput>
  }

  export type ChatRoomUpdateManyWithWhereWithoutStudentInput = {
    where: ChatRoomScalarWhereInput
    data: XOR<ChatRoomUpdateManyMutationInput, ChatRoomUncheckedUpdateManyWithoutStudentInput>
  }

  export type ChatRoomScalarWhereInput = {
    AND?: ChatRoomScalarWhereInput | ChatRoomScalarWhereInput[]
    OR?: ChatRoomScalarWhereInput[]
    NOT?: ChatRoomScalarWhereInput | ChatRoomScalarWhereInput[]
    id?: StringFilter<"ChatRoom"> | string
    studentId?: StringFilter<"ChatRoom"> | string
    agentId?: StringFilter<"ChatRoom"> | string
    propertyId?: StringFilter<"ChatRoom"> | string
    createdAt?: DateTimeFilter<"ChatRoom"> | Date | string
  }

  export type ChatRoomUpsertWithWhereUniqueWithoutAgentInput = {
    where: ChatRoomWhereUniqueInput
    update: XOR<ChatRoomUpdateWithoutAgentInput, ChatRoomUncheckedUpdateWithoutAgentInput>
    create: XOR<ChatRoomCreateWithoutAgentInput, ChatRoomUncheckedCreateWithoutAgentInput>
  }

  export type ChatRoomUpdateWithWhereUniqueWithoutAgentInput = {
    where: ChatRoomWhereUniqueInput
    data: XOR<ChatRoomUpdateWithoutAgentInput, ChatRoomUncheckedUpdateWithoutAgentInput>
  }

  export type ChatRoomUpdateManyWithWhereWithoutAgentInput = {
    where: ChatRoomScalarWhereInput
    data: XOR<ChatRoomUpdateManyMutationInput, ChatRoomUncheckedUpdateManyWithoutAgentInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
  }

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSenderInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    chatRoomId?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    text?: StringFilter<"Message"> | string
    isRead?: BoolFilter<"Message"> | boolean
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type ReportUpsertWithWhereUniqueWithoutReporterInput = {
    where: ReportWhereUniqueInput
    update: XOR<ReportUpdateWithoutReporterInput, ReportUncheckedUpdateWithoutReporterInput>
    create: XOR<ReportCreateWithoutReporterInput, ReportUncheckedCreateWithoutReporterInput>
  }

  export type ReportUpdateWithWhereUniqueWithoutReporterInput = {
    where: ReportWhereUniqueInput
    data: XOR<ReportUpdateWithoutReporterInput, ReportUncheckedUpdateWithoutReporterInput>
  }

  export type ReportUpdateManyWithWhereWithoutReporterInput = {
    where: ReportScalarWhereInput
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyWithoutReporterInput>
  }

  export type ReportScalarWhereInput = {
    AND?: ReportScalarWhereInput | ReportScalarWhereInput[]
    OR?: ReportScalarWhereInput[]
    NOT?: ReportScalarWhereInput | ReportScalarWhereInput[]
    id?: StringFilter<"Report"> | string
    reporterId?: StringFilter<"Report"> | string
    propertyId?: StringNullableFilter<"Report"> | string | null
    roommateId?: StringNullableFilter<"Report"> | string | null
    reason?: EnumReportReasonFilter<"Report"> | $Enums.ReportReason
    customReason?: StringNullableFilter<"Report"> | string | null
    description?: StringFilter<"Report"> | string
    status?: EnumReportStatusFilter<"Report"> | $Enums.ReportStatus
    createdAt?: DateTimeFilter<"Report"> | Date | string
    updatedAt?: DateTimeFilter<"Report"> | Date | string
  }

  export type UserCreateWithoutStudentProfileInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateWithoutStudentProfileInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserCreateOrConnectWithoutStudentProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStudentProfileInput, UserUncheckedCreateWithoutStudentProfileInput>
  }

  export type PropertyCreateWithoutStudentInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: AgentProfileCreateNestedOneWithoutPropertiesInput
    inquiries?: InquiryCreateNestedManyWithoutPropertyInput
    viewings?: ViewingCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomCreateNestedManyWithoutPropertyInput
    reports?: ReportCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutStudentInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    agentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inquiries?: InquiryUncheckedCreateNestedManyWithoutPropertyInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomUncheckedCreateNestedManyWithoutPropertyInput
    reports?: ReportUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutStudentInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutStudentInput, PropertyUncheckedCreateWithoutStudentInput>
  }

  export type PropertyCreateManyStudentInputEnvelope = {
    data: PropertyCreateManyStudentInput | PropertyCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type ReportCreateWithoutRoommateInput = {
    id?: string
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    reporter: UserCreateNestedOneWithoutReportsSubmittedInput
    property?: PropertyCreateNestedOneWithoutReportsInput
  }

  export type ReportUncheckedCreateWithoutRoommateInput = {
    id?: string
    reporterId: string
    propertyId?: string | null
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReportCreateOrConnectWithoutRoommateInput = {
    where: ReportWhereUniqueInput
    create: XOR<ReportCreateWithoutRoommateInput, ReportUncheckedCreateWithoutRoommateInput>
  }

  export type ReportCreateManyRoommateInputEnvelope = {
    data: ReportCreateManyRoommateInput | ReportCreateManyRoommateInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutStudentProfileInput = {
    update: XOR<UserUpdateWithoutStudentProfileInput, UserUncheckedUpdateWithoutStudentProfileInput>
    create: XOR<UserCreateWithoutStudentProfileInput, UserUncheckedCreateWithoutStudentProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStudentProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStudentProfileInput, UserUncheckedUpdateWithoutStudentProfileInput>
  }

  export type UserUpdateWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type PropertyUpsertWithWhereUniqueWithoutStudentInput = {
    where: PropertyWhereUniqueInput
    update: XOR<PropertyUpdateWithoutStudentInput, PropertyUncheckedUpdateWithoutStudentInput>
    create: XOR<PropertyCreateWithoutStudentInput, PropertyUncheckedCreateWithoutStudentInput>
  }

  export type PropertyUpdateWithWhereUniqueWithoutStudentInput = {
    where: PropertyWhereUniqueInput
    data: XOR<PropertyUpdateWithoutStudentInput, PropertyUncheckedUpdateWithoutStudentInput>
  }

  export type PropertyUpdateManyWithWhereWithoutStudentInput = {
    where: PropertyScalarWhereInput
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyWithoutStudentInput>
  }

  export type PropertyScalarWhereInput = {
    AND?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
    OR?: PropertyScalarWhereInput[]
    NOT?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
    id?: StringFilter<"Property"> | string
    title?: StringFilter<"Property"> | string
    hostelType?: StringFilter<"Property"> | string
    price?: FloatFilter<"Property"> | number
    location?: StringFilter<"Property"> | string
    distance?: StringFilter<"Property"> | string
    description?: StringFilter<"Property"> | string
    amenities?: StringNullableListFilter<"Property">
    images?: StringNullableListFilter<"Property">
    latitude?: FloatNullableFilter<"Property"> | number | null
    longitude?: FloatNullableFilter<"Property"> | number | null
    isAvailable?: BoolFilter<"Property"> | boolean
    isVerified?: BoolFilter<"Property"> | boolean
    views?: IntFilter<"Property"> | number
    university?: StringFilter<"Property"> | string
    isRoommateOption?: BoolFilter<"Property"> | boolean
    agentId?: StringNullableFilter<"Property"> | string | null
    studentId?: StringNullableFilter<"Property"> | string | null
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
  }

  export type ReportUpsertWithWhereUniqueWithoutRoommateInput = {
    where: ReportWhereUniqueInput
    update: XOR<ReportUpdateWithoutRoommateInput, ReportUncheckedUpdateWithoutRoommateInput>
    create: XOR<ReportCreateWithoutRoommateInput, ReportUncheckedCreateWithoutRoommateInput>
  }

  export type ReportUpdateWithWhereUniqueWithoutRoommateInput = {
    where: ReportWhereUniqueInput
    data: XOR<ReportUpdateWithoutRoommateInput, ReportUncheckedUpdateWithoutRoommateInput>
  }

  export type ReportUpdateManyWithWhereWithoutRoommateInput = {
    where: ReportScalarWhereInput
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyWithoutRoommateInput>
  }

  export type UserCreateWithoutAgentProfileInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateWithoutAgentProfileInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserCreateOrConnectWithoutAgentProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAgentProfileInput, UserUncheckedCreateWithoutAgentProfileInput>
  }

  export type PropertyCreateWithoutAgentInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentProfileCreateNestedOneWithoutPropertiesInput
    inquiries?: InquiryCreateNestedManyWithoutPropertyInput
    viewings?: ViewingCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomCreateNestedManyWithoutPropertyInput
    reports?: ReportCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutAgentInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    studentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inquiries?: InquiryUncheckedCreateNestedManyWithoutPropertyInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomUncheckedCreateNestedManyWithoutPropertyInput
    reports?: ReportUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutAgentInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutAgentInput, PropertyUncheckedCreateWithoutAgentInput>
  }

  export type PropertyCreateManyAgentInputEnvelope = {
    data: PropertyCreateManyAgentInput | PropertyCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAgentProfileInput = {
    update: XOR<UserUpdateWithoutAgentProfileInput, UserUncheckedUpdateWithoutAgentProfileInput>
    create: XOR<UserCreateWithoutAgentProfileInput, UserUncheckedCreateWithoutAgentProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAgentProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAgentProfileInput, UserUncheckedUpdateWithoutAgentProfileInput>
  }

  export type UserUpdateWithoutAgentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateWithoutAgentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type PropertyUpsertWithWhereUniqueWithoutAgentInput = {
    where: PropertyWhereUniqueInput
    update: XOR<PropertyUpdateWithoutAgentInput, PropertyUncheckedUpdateWithoutAgentInput>
    create: XOR<PropertyCreateWithoutAgentInput, PropertyUncheckedCreateWithoutAgentInput>
  }

  export type PropertyUpdateWithWhereUniqueWithoutAgentInput = {
    where: PropertyWhereUniqueInput
    data: XOR<PropertyUpdateWithoutAgentInput, PropertyUncheckedUpdateWithoutAgentInput>
  }

  export type PropertyUpdateManyWithWhereWithoutAgentInput = {
    where: PropertyScalarWhereInput
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyWithoutAgentInput>
  }

  export type AgentProfileCreateWithoutPropertiesInput = {
    id?: string
    fullName: string
    address?: string | null
    agencyName?: string | null
    bio?: string | null
    ninDocument?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAgentProfileInput
  }

  export type AgentProfileUncheckedCreateWithoutPropertiesInput = {
    id?: string
    userId: string
    fullName: string
    address?: string | null
    agencyName?: string | null
    bio?: string | null
    ninDocument?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentProfileCreateOrConnectWithoutPropertiesInput = {
    where: AgentProfileWhereUniqueInput
    create: XOR<AgentProfileCreateWithoutPropertiesInput, AgentProfileUncheckedCreateWithoutPropertiesInput>
  }

  export type StudentProfileCreateWithoutPropertiesInput = {
    id?: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    reports?: ReportCreateNestedManyWithoutRoommateInput
  }

  export type StudentProfileUncheckedCreateWithoutPropertiesInput = {
    id?: string
    userId: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reports?: ReportUncheckedCreateNestedManyWithoutRoommateInput
  }

  export type StudentProfileCreateOrConnectWithoutPropertiesInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutPropertiesInput, StudentProfileUncheckedCreateWithoutPropertiesInput>
  }

  export type InquiryCreateWithoutPropertyInput = {
    id?: string
    message: string
    createdAt?: Date | string
    student: UserCreateNestedOneWithoutInquiriesInput
    agent: UserCreateNestedOneWithoutReceivedInquiriesInput
  }

  export type InquiryUncheckedCreateWithoutPropertyInput = {
    id?: string
    studentId: string
    agentId: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryCreateOrConnectWithoutPropertyInput = {
    where: InquiryWhereUniqueInput
    create: XOR<InquiryCreateWithoutPropertyInput, InquiryUncheckedCreateWithoutPropertyInput>
  }

  export type InquiryCreateManyPropertyInputEnvelope = {
    data: InquiryCreateManyPropertyInput | InquiryCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type ViewingCreateWithoutPropertyInput = {
    id?: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    student: UserCreateNestedOneWithoutViewingsInput
  }

  export type ViewingUncheckedCreateWithoutPropertyInput = {
    id?: string
    studentId: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ViewingCreateOrConnectWithoutPropertyInput = {
    where: ViewingWhereUniqueInput
    create: XOR<ViewingCreateWithoutPropertyInput, ViewingUncheckedCreateWithoutPropertyInput>
  }

  export type ViewingCreateManyPropertyInputEnvelope = {
    data: ViewingCreateManyPropertyInput | ViewingCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type ChatRoomCreateWithoutPropertyInput = {
    id?: string
    createdAt?: Date | string
    student: UserCreateNestedOneWithoutStudentChatRoomsInput
    agent: UserCreateNestedOneWithoutAgentChatRoomsInput
    messages?: MessageCreateNestedManyWithoutChatRoomInput
  }

  export type ChatRoomUncheckedCreateWithoutPropertyInput = {
    id?: string
    studentId: string
    agentId: string
    createdAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutChatRoomInput
  }

  export type ChatRoomCreateOrConnectWithoutPropertyInput = {
    where: ChatRoomWhereUniqueInput
    create: XOR<ChatRoomCreateWithoutPropertyInput, ChatRoomUncheckedCreateWithoutPropertyInput>
  }

  export type ChatRoomCreateManyPropertyInputEnvelope = {
    data: ChatRoomCreateManyPropertyInput | ChatRoomCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type ReportCreateWithoutPropertyInput = {
    id?: string
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    reporter: UserCreateNestedOneWithoutReportsSubmittedInput
    roommate?: StudentProfileCreateNestedOneWithoutReportsInput
  }

  export type ReportUncheckedCreateWithoutPropertyInput = {
    id?: string
    reporterId: string
    roommateId?: string | null
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReportCreateOrConnectWithoutPropertyInput = {
    where: ReportWhereUniqueInput
    create: XOR<ReportCreateWithoutPropertyInput, ReportUncheckedCreateWithoutPropertyInput>
  }

  export type ReportCreateManyPropertyInputEnvelope = {
    data: ReportCreateManyPropertyInput | ReportCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type AgentProfileUpsertWithoutPropertiesInput = {
    update: XOR<AgentProfileUpdateWithoutPropertiesInput, AgentProfileUncheckedUpdateWithoutPropertiesInput>
    create: XOR<AgentProfileCreateWithoutPropertiesInput, AgentProfileUncheckedCreateWithoutPropertiesInput>
    where?: AgentProfileWhereInput
  }

  export type AgentProfileUpdateToOneWithWhereWithoutPropertiesInput = {
    where?: AgentProfileWhereInput
    data: XOR<AgentProfileUpdateWithoutPropertiesInput, AgentProfileUncheckedUpdateWithoutPropertiesInput>
  }

  export type AgentProfileUpdateWithoutPropertiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    agencyName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    ninDocument?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAgentProfileNestedInput
  }

  export type AgentProfileUncheckedUpdateWithoutPropertiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    agencyName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    ninDocument?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProfileUpsertWithoutPropertiesInput = {
    update: XOR<StudentProfileUpdateWithoutPropertiesInput, StudentProfileUncheckedUpdateWithoutPropertiesInput>
    create: XOR<StudentProfileCreateWithoutPropertiesInput, StudentProfileUncheckedCreateWithoutPropertiesInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutPropertiesInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutPropertiesInput, StudentProfileUncheckedUpdateWithoutPropertiesInput>
  }

  export type StudentProfileUpdateWithoutPropertiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    reports?: ReportUpdateManyWithoutRoommateNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutPropertiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: ReportUncheckedUpdateManyWithoutRoommateNestedInput
  }

  export type InquiryUpsertWithWhereUniqueWithoutPropertyInput = {
    where: InquiryWhereUniqueInput
    update: XOR<InquiryUpdateWithoutPropertyInput, InquiryUncheckedUpdateWithoutPropertyInput>
    create: XOR<InquiryCreateWithoutPropertyInput, InquiryUncheckedCreateWithoutPropertyInput>
  }

  export type InquiryUpdateWithWhereUniqueWithoutPropertyInput = {
    where: InquiryWhereUniqueInput
    data: XOR<InquiryUpdateWithoutPropertyInput, InquiryUncheckedUpdateWithoutPropertyInput>
  }

  export type InquiryUpdateManyWithWhereWithoutPropertyInput = {
    where: InquiryScalarWhereInput
    data: XOR<InquiryUpdateManyMutationInput, InquiryUncheckedUpdateManyWithoutPropertyInput>
  }

  export type ViewingUpsertWithWhereUniqueWithoutPropertyInput = {
    where: ViewingWhereUniqueInput
    update: XOR<ViewingUpdateWithoutPropertyInput, ViewingUncheckedUpdateWithoutPropertyInput>
    create: XOR<ViewingCreateWithoutPropertyInput, ViewingUncheckedCreateWithoutPropertyInput>
  }

  export type ViewingUpdateWithWhereUniqueWithoutPropertyInput = {
    where: ViewingWhereUniqueInput
    data: XOR<ViewingUpdateWithoutPropertyInput, ViewingUncheckedUpdateWithoutPropertyInput>
  }

  export type ViewingUpdateManyWithWhereWithoutPropertyInput = {
    where: ViewingScalarWhereInput
    data: XOR<ViewingUpdateManyMutationInput, ViewingUncheckedUpdateManyWithoutPropertyInput>
  }

  export type ChatRoomUpsertWithWhereUniqueWithoutPropertyInput = {
    where: ChatRoomWhereUniqueInput
    update: XOR<ChatRoomUpdateWithoutPropertyInput, ChatRoomUncheckedUpdateWithoutPropertyInput>
    create: XOR<ChatRoomCreateWithoutPropertyInput, ChatRoomUncheckedCreateWithoutPropertyInput>
  }

  export type ChatRoomUpdateWithWhereUniqueWithoutPropertyInput = {
    where: ChatRoomWhereUniqueInput
    data: XOR<ChatRoomUpdateWithoutPropertyInput, ChatRoomUncheckedUpdateWithoutPropertyInput>
  }

  export type ChatRoomUpdateManyWithWhereWithoutPropertyInput = {
    where: ChatRoomScalarWhereInput
    data: XOR<ChatRoomUpdateManyMutationInput, ChatRoomUncheckedUpdateManyWithoutPropertyInput>
  }

  export type ReportUpsertWithWhereUniqueWithoutPropertyInput = {
    where: ReportWhereUniqueInput
    update: XOR<ReportUpdateWithoutPropertyInput, ReportUncheckedUpdateWithoutPropertyInput>
    create: XOR<ReportCreateWithoutPropertyInput, ReportUncheckedCreateWithoutPropertyInput>
  }

  export type ReportUpdateWithWhereUniqueWithoutPropertyInput = {
    where: ReportWhereUniqueInput
    data: XOR<ReportUpdateWithoutPropertyInput, ReportUncheckedUpdateWithoutPropertyInput>
  }

  export type ReportUpdateManyWithWhereWithoutPropertyInput = {
    where: ReportScalarWhereInput
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyWithoutPropertyInput>
  }

  export type UserCreateWithoutInquiriesInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateWithoutInquiriesInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserCreateOrConnectWithoutInquiriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInquiriesInput, UserUncheckedCreateWithoutInquiriesInput>
  }

  export type PropertyCreateWithoutInquiriesInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: AgentProfileCreateNestedOneWithoutPropertiesInput
    student?: StudentProfileCreateNestedOneWithoutPropertiesInput
    viewings?: ViewingCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomCreateNestedManyWithoutPropertyInput
    reports?: ReportCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutInquiriesInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    agentId?: string | null
    studentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    viewings?: ViewingUncheckedCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomUncheckedCreateNestedManyWithoutPropertyInput
    reports?: ReportUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutInquiriesInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutInquiriesInput, PropertyUncheckedCreateWithoutInquiriesInput>
  }

  export type UserCreateWithoutReceivedInquiriesInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateWithoutReceivedInquiriesInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserCreateOrConnectWithoutReceivedInquiriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedInquiriesInput, UserUncheckedCreateWithoutReceivedInquiriesInput>
  }

  export type UserUpsertWithoutInquiriesInput = {
    update: XOR<UserUpdateWithoutInquiriesInput, UserUncheckedUpdateWithoutInquiriesInput>
    create: XOR<UserCreateWithoutInquiriesInput, UserUncheckedCreateWithoutInquiriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInquiriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInquiriesInput, UserUncheckedUpdateWithoutInquiriesInput>
  }

  export type UserUpdateWithoutInquiriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateWithoutInquiriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type PropertyUpsertWithoutInquiriesInput = {
    update: XOR<PropertyUpdateWithoutInquiriesInput, PropertyUncheckedUpdateWithoutInquiriesInput>
    create: XOR<PropertyCreateWithoutInquiriesInput, PropertyUncheckedCreateWithoutInquiriesInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutInquiriesInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutInquiriesInput, PropertyUncheckedUpdateWithoutInquiriesInput>
  }

  export type PropertyUpdateWithoutInquiriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentProfileUpdateOneWithoutPropertiesNestedInput
    student?: StudentProfileUpdateOneWithoutPropertiesNestedInput
    viewings?: ViewingUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUpdateManyWithoutPropertyNestedInput
    reports?: ReportUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutInquiriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viewings?: ViewingUncheckedUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUncheckedUpdateManyWithoutPropertyNestedInput
    reports?: ReportUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type UserUpsertWithoutReceivedInquiriesInput = {
    update: XOR<UserUpdateWithoutReceivedInquiriesInput, UserUncheckedUpdateWithoutReceivedInquiriesInput>
    create: XOR<UserCreateWithoutReceivedInquiriesInput, UserUncheckedCreateWithoutReceivedInquiriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedInquiriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedInquiriesInput, UserUncheckedUpdateWithoutReceivedInquiriesInput>
  }

  export type UserUpdateWithoutReceivedInquiriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedInquiriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type UserCreateWithoutViewingsInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateWithoutViewingsInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserCreateOrConnectWithoutViewingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutViewingsInput, UserUncheckedCreateWithoutViewingsInput>
  }

  export type PropertyCreateWithoutViewingsInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: AgentProfileCreateNestedOneWithoutPropertiesInput
    student?: StudentProfileCreateNestedOneWithoutPropertiesInput
    inquiries?: InquiryCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomCreateNestedManyWithoutPropertyInput
    reports?: ReportCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutViewingsInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    agentId?: string | null
    studentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inquiries?: InquiryUncheckedCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomUncheckedCreateNestedManyWithoutPropertyInput
    reports?: ReportUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutViewingsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutViewingsInput, PropertyUncheckedCreateWithoutViewingsInput>
  }

  export type UserUpsertWithoutViewingsInput = {
    update: XOR<UserUpdateWithoutViewingsInput, UserUncheckedUpdateWithoutViewingsInput>
    create: XOR<UserCreateWithoutViewingsInput, UserUncheckedCreateWithoutViewingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutViewingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutViewingsInput, UserUncheckedUpdateWithoutViewingsInput>
  }

  export type UserUpdateWithoutViewingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateWithoutViewingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type PropertyUpsertWithoutViewingsInput = {
    update: XOR<PropertyUpdateWithoutViewingsInput, PropertyUncheckedUpdateWithoutViewingsInput>
    create: XOR<PropertyCreateWithoutViewingsInput, PropertyUncheckedCreateWithoutViewingsInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutViewingsInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutViewingsInput, PropertyUncheckedUpdateWithoutViewingsInput>
  }

  export type PropertyUpdateWithoutViewingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentProfileUpdateOneWithoutPropertiesNestedInput
    student?: StudentProfileUpdateOneWithoutPropertiesNestedInput
    inquiries?: InquiryUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUpdateManyWithoutPropertyNestedInput
    reports?: ReportUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutViewingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inquiries?: InquiryUncheckedUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUncheckedUpdateManyWithoutPropertyNestedInput
    reports?: ReportUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type UserCreateWithoutStudentChatRoomsInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateWithoutStudentChatRoomsInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserCreateOrConnectWithoutStudentChatRoomsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStudentChatRoomsInput, UserUncheckedCreateWithoutStudentChatRoomsInput>
  }

  export type UserCreateWithoutAgentChatRoomsInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateWithoutAgentChatRoomsInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserCreateOrConnectWithoutAgentChatRoomsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAgentChatRoomsInput, UserUncheckedCreateWithoutAgentChatRoomsInput>
  }

  export type PropertyCreateWithoutChatRoomsInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: AgentProfileCreateNestedOneWithoutPropertiesInput
    student?: StudentProfileCreateNestedOneWithoutPropertiesInput
    inquiries?: InquiryCreateNestedManyWithoutPropertyInput
    viewings?: ViewingCreateNestedManyWithoutPropertyInput
    reports?: ReportCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutChatRoomsInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    agentId?: string | null
    studentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inquiries?: InquiryUncheckedCreateNestedManyWithoutPropertyInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutPropertyInput
    reports?: ReportUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutChatRoomsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutChatRoomsInput, PropertyUncheckedCreateWithoutChatRoomsInput>
  }

  export type MessageCreateWithoutChatRoomInput = {
    id?: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
    sender: UserCreateNestedOneWithoutMessagesSentInput
  }

  export type MessageUncheckedCreateWithoutChatRoomInput = {
    id?: string
    senderId: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutChatRoomInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutChatRoomInput, MessageUncheckedCreateWithoutChatRoomInput>
  }

  export type MessageCreateManyChatRoomInputEnvelope = {
    data: MessageCreateManyChatRoomInput | MessageCreateManyChatRoomInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutStudentChatRoomsInput = {
    update: XOR<UserUpdateWithoutStudentChatRoomsInput, UserUncheckedUpdateWithoutStudentChatRoomsInput>
    create: XOR<UserCreateWithoutStudentChatRoomsInput, UserUncheckedCreateWithoutStudentChatRoomsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStudentChatRoomsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStudentChatRoomsInput, UserUncheckedUpdateWithoutStudentChatRoomsInput>
  }

  export type UserUpdateWithoutStudentChatRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateWithoutStudentChatRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type UserUpsertWithoutAgentChatRoomsInput = {
    update: XOR<UserUpdateWithoutAgentChatRoomsInput, UserUncheckedUpdateWithoutAgentChatRoomsInput>
    create: XOR<UserCreateWithoutAgentChatRoomsInput, UserUncheckedCreateWithoutAgentChatRoomsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAgentChatRoomsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAgentChatRoomsInput, UserUncheckedUpdateWithoutAgentChatRoomsInput>
  }

  export type UserUpdateWithoutAgentChatRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateWithoutAgentChatRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type PropertyUpsertWithoutChatRoomsInput = {
    update: XOR<PropertyUpdateWithoutChatRoomsInput, PropertyUncheckedUpdateWithoutChatRoomsInput>
    create: XOR<PropertyCreateWithoutChatRoomsInput, PropertyUncheckedCreateWithoutChatRoomsInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutChatRoomsInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutChatRoomsInput, PropertyUncheckedUpdateWithoutChatRoomsInput>
  }

  export type PropertyUpdateWithoutChatRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentProfileUpdateOneWithoutPropertiesNestedInput
    student?: StudentProfileUpdateOneWithoutPropertiesNestedInput
    inquiries?: InquiryUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUpdateManyWithoutPropertyNestedInput
    reports?: ReportUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutChatRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inquiries?: InquiryUncheckedUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutPropertyNestedInput
    reports?: ReportUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type MessageUpsertWithWhereUniqueWithoutChatRoomInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutChatRoomInput, MessageUncheckedUpdateWithoutChatRoomInput>
    create: XOR<MessageCreateWithoutChatRoomInput, MessageUncheckedCreateWithoutChatRoomInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutChatRoomInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutChatRoomInput, MessageUncheckedUpdateWithoutChatRoomInput>
  }

  export type MessageUpdateManyWithWhereWithoutChatRoomInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutChatRoomInput>
  }

  export type ChatRoomCreateWithoutMessagesInput = {
    id?: string
    createdAt?: Date | string
    student: UserCreateNestedOneWithoutStudentChatRoomsInput
    agent: UserCreateNestedOneWithoutAgentChatRoomsInput
    property: PropertyCreateNestedOneWithoutChatRoomsInput
  }

  export type ChatRoomUncheckedCreateWithoutMessagesInput = {
    id?: string
    studentId: string
    agentId: string
    propertyId: string
    createdAt?: Date | string
  }

  export type ChatRoomCreateOrConnectWithoutMessagesInput = {
    where: ChatRoomWhereUniqueInput
    create: XOR<ChatRoomCreateWithoutMessagesInput, ChatRoomUncheckedCreateWithoutMessagesInput>
  }

  export type UserCreateWithoutMessagesSentInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    reportsSubmitted?: ReportCreateNestedManyWithoutReporterInput
  }

  export type UserUncheckedCreateWithoutMessagesSentInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    reportsSubmitted?: ReportUncheckedCreateNestedManyWithoutReporterInput
  }

  export type UserCreateOrConnectWithoutMessagesSentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessagesSentInput, UserUncheckedCreateWithoutMessagesSentInput>
  }

  export type ChatRoomUpsertWithoutMessagesInput = {
    update: XOR<ChatRoomUpdateWithoutMessagesInput, ChatRoomUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatRoomCreateWithoutMessagesInput, ChatRoomUncheckedCreateWithoutMessagesInput>
    where?: ChatRoomWhereInput
  }

  export type ChatRoomUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatRoomWhereInput
    data: XOR<ChatRoomUpdateWithoutMessagesInput, ChatRoomUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatRoomUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutStudentChatRoomsNestedInput
    agent?: UserUpdateOneRequiredWithoutAgentChatRoomsNestedInput
    property?: PropertyUpdateOneRequiredWithoutChatRoomsNestedInput
  }

  export type ChatRoomUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutMessagesSentInput = {
    update: XOR<UserUpdateWithoutMessagesSentInput, UserUncheckedUpdateWithoutMessagesSentInput>
    create: XOR<UserCreateWithoutMessagesSentInput, UserUncheckedCreateWithoutMessagesSentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMessagesSentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMessagesSentInput, UserUncheckedUpdateWithoutMessagesSentInput>
  }

  export type UserUpdateWithoutMessagesSentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    reportsSubmitted?: ReportUpdateManyWithoutReporterNestedInput
  }

  export type UserUncheckedUpdateWithoutMessagesSentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    reportsSubmitted?: ReportUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type UserCreateWithoutReportsSubmittedInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileCreateNestedOneWithoutUserInput
    inquiries?: InquiryCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryCreateNestedManyWithoutAgentInput
    viewings?: ViewingCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomCreateNestedManyWithoutAgentInput
    messagesSent?: MessageCreateNestedManyWithoutSenderInput
  }

  export type UserUncheckedCreateWithoutReportsSubmittedInput = {
    id?: string
    email: string
    phone: string
    password: string
    role?: $Enums.Role
    isEmailVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    agentProfile?: AgentProfileUncheckedCreateNestedOneWithoutUserInput
    inquiries?: InquiryUncheckedCreateNestedManyWithoutStudentInput
    receivedInquiries?: InquiryUncheckedCreateNestedManyWithoutAgentInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutStudentInput
    studentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutStudentInput
    agentChatRooms?: ChatRoomUncheckedCreateNestedManyWithoutAgentInput
    messagesSent?: MessageUncheckedCreateNestedManyWithoutSenderInput
  }

  export type UserCreateOrConnectWithoutReportsSubmittedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReportsSubmittedInput, UserUncheckedCreateWithoutReportsSubmittedInput>
  }

  export type PropertyCreateWithoutReportsInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: AgentProfileCreateNestedOneWithoutPropertiesInput
    student?: StudentProfileCreateNestedOneWithoutPropertiesInput
    inquiries?: InquiryCreateNestedManyWithoutPropertyInput
    viewings?: ViewingCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutReportsInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    agentId?: string | null
    studentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inquiries?: InquiryUncheckedCreateNestedManyWithoutPropertyInput
    viewings?: ViewingUncheckedCreateNestedManyWithoutPropertyInput
    chatRooms?: ChatRoomUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutReportsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutReportsInput, PropertyUncheckedCreateWithoutReportsInput>
  }

  export type StudentProfileCreateWithoutReportsInput = {
    id?: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    properties?: PropertyCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutReportsInput = {
    id?: string
    userId: string
    fullName: string
    university: string
    username: string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: boolean
    idCardDoc?: string | null
    feesReceiptDoc?: string | null
    portalScreenshotDoc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    properties?: PropertyUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutReportsInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutReportsInput, StudentProfileUncheckedCreateWithoutReportsInput>
  }

  export type UserUpsertWithoutReportsSubmittedInput = {
    update: XOR<UserUpdateWithoutReportsSubmittedInput, UserUncheckedUpdateWithoutReportsSubmittedInput>
    create: XOR<UserCreateWithoutReportsSubmittedInput, UserUncheckedCreateWithoutReportsSubmittedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReportsSubmittedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReportsSubmittedInput, UserUncheckedUpdateWithoutReportsSubmittedInput>
  }

  export type UserUpdateWithoutReportsSubmittedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUpdateManyWithoutSenderNestedInput
  }

  export type UserUncheckedUpdateWithoutReportsSubmittedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    agentProfile?: AgentProfileUncheckedUpdateOneWithoutUserNestedInput
    inquiries?: InquiryUncheckedUpdateManyWithoutStudentNestedInput
    receivedInquiries?: InquiryUncheckedUpdateManyWithoutAgentNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutStudentNestedInput
    studentChatRooms?: ChatRoomUncheckedUpdateManyWithoutStudentNestedInput
    agentChatRooms?: ChatRoomUncheckedUpdateManyWithoutAgentNestedInput
    messagesSent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
  }

  export type PropertyUpsertWithoutReportsInput = {
    update: XOR<PropertyUpdateWithoutReportsInput, PropertyUncheckedUpdateWithoutReportsInput>
    create: XOR<PropertyCreateWithoutReportsInput, PropertyUncheckedCreateWithoutReportsInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutReportsInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutReportsInput, PropertyUncheckedUpdateWithoutReportsInput>
  }

  export type PropertyUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentProfileUpdateOneWithoutPropertiesNestedInput
    student?: StudentProfileUpdateOneWithoutPropertiesNestedInput
    inquiries?: InquiryUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inquiries?: InquiryUncheckedUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type StudentProfileUpsertWithoutReportsInput = {
    update: XOR<StudentProfileUpdateWithoutReportsInput, StudentProfileUncheckedUpdateWithoutReportsInput>
    create: XOR<StudentProfileCreateWithoutReportsInput, StudentProfileUncheckedCreateWithoutReportsInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutReportsInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutReportsInput, StudentProfileUncheckedUpdateWithoutReportsInput>
  }

  export type StudentProfileUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    properties?: PropertyUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    preferences?: NullableJsonNullValueInput | InputJsonValue
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    idCardDoc?: NullableStringFieldUpdateOperationsInput | string | null
    feesReceiptDoc?: NullableStringFieldUpdateOperationsInput | string | null
    portalScreenshotDoc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    properties?: PropertyUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type InquiryCreateManyStudentInput = {
    id?: string
    propertyId: string
    agentId: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryCreateManyAgentInput = {
    id?: string
    studentId: string
    propertyId: string
    message: string
    createdAt?: Date | string
  }

  export type ViewingCreateManyStudentInput = {
    id?: string
    propertyId: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatRoomCreateManyStudentInput = {
    id?: string
    agentId: string
    propertyId: string
    createdAt?: Date | string
  }

  export type ChatRoomCreateManyAgentInput = {
    id?: string
    studentId: string
    propertyId: string
    createdAt?: Date | string
  }

  export type MessageCreateManySenderInput = {
    id?: string
    chatRoomId: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type ReportCreateManyReporterInput = {
    id?: string
    propertyId?: string | null
    roommateId?: string | null
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InquiryUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutInquiriesNestedInput
    agent?: UserUpdateOneRequiredWithoutReceivedInquiriesNestedInput
  }

  export type InquiryUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutInquiriesNestedInput
    property?: PropertyUpdateOneRequiredWithoutInquiriesNestedInput
  }

  export type InquiryUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViewingUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutViewingsNestedInput
  }

  export type ViewingUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViewingUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatRoomUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneRequiredWithoutAgentChatRoomsNestedInput
    property?: PropertyUpdateOneRequiredWithoutChatRoomsNestedInput
    messages?: MessageUpdateManyWithoutChatRoomNestedInput
  }

  export type ChatRoomUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutChatRoomNestedInput
  }

  export type ChatRoomUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatRoomUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutStudentChatRoomsNestedInput
    property?: PropertyUpdateOneRequiredWithoutChatRoomsNestedInput
    messages?: MessageUpdateManyWithoutChatRoomNestedInput
  }

  export type ChatRoomUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutChatRoomNestedInput
  }

  export type ChatRoomUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chatRoom?: ChatRoomUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatRoomId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatRoomId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUpdateWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneWithoutReportsNestedInput
    roommate?: StudentProfileUpdateOneWithoutReportsNestedInput
  }

  export type ReportUncheckedUpdateWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    roommateId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    roommateId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyCreateManyStudentInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    agentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReportCreateManyRoommateInput = {
    id?: string
    reporterId: string
    propertyId?: string | null
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PropertyUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentProfileUpdateOneWithoutPropertiesNestedInput
    inquiries?: InquiryUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUpdateManyWithoutPropertyNestedInput
    reports?: ReportUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inquiries?: InquiryUncheckedUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUncheckedUpdateManyWithoutPropertyNestedInput
    reports?: ReportUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUpdateWithoutRoommateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reporter?: UserUpdateOneRequiredWithoutReportsSubmittedNestedInput
    property?: PropertyUpdateOneWithoutReportsNestedInput
  }

  export type ReportUncheckedUpdateWithoutRoommateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyWithoutRoommateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyCreateManyAgentInput = {
    id?: string
    title: string
    hostelType: string
    price: number
    location: string
    distance: string
    description: string
    amenities?: PropertyCreateamenitiesInput | string[]
    images?: PropertyCreateimagesInput | string[]
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
    isVerified?: boolean
    views?: number
    university?: string
    isRoommateOption?: boolean
    studentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PropertyUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentProfileUpdateOneWithoutPropertiesNestedInput
    inquiries?: InquiryUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUpdateManyWithoutPropertyNestedInput
    reports?: ReportUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    studentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inquiries?: InquiryUncheckedUpdateManyWithoutPropertyNestedInput
    viewings?: ViewingUncheckedUpdateManyWithoutPropertyNestedInput
    chatRooms?: ChatRoomUncheckedUpdateManyWithoutPropertyNestedInput
    reports?: ReportUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    hostelType?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    location?: StringFieldUpdateOperationsInput | string
    distance?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amenities?: PropertyUpdateamenitiesInput | string[]
    images?: PropertyUpdateimagesInput | string[]
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    isAvailable?: BoolFieldUpdateOperationsInput | boolean
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    university?: StringFieldUpdateOperationsInput | string
    isRoommateOption?: BoolFieldUpdateOperationsInput | boolean
    studentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryCreateManyPropertyInput = {
    id?: string
    studentId: string
    agentId: string
    message: string
    createdAt?: Date | string
  }

  export type ViewingCreateManyPropertyInput = {
    id?: string
    studentId: string
    dateTime: Date | string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatRoomCreateManyPropertyInput = {
    id?: string
    studentId: string
    agentId: string
    createdAt?: Date | string
  }

  export type ReportCreateManyPropertyInput = {
    id?: string
    reporterId: string
    roommateId?: string | null
    reason: $Enums.ReportReason
    customReason?: string | null
    description: string
    status?: $Enums.ReportStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InquiryUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutInquiriesNestedInput
    agent?: UserUpdateOneRequiredWithoutReceivedInquiriesNestedInput
  }

  export type InquiryUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViewingUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutViewingsNestedInput
  }

  export type ViewingUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViewingUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatRoomUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: UserUpdateOneRequiredWithoutStudentChatRoomsNestedInput
    agent?: UserUpdateOneRequiredWithoutAgentChatRoomsNestedInput
    messages?: MessageUpdateManyWithoutChatRoomNestedInput
  }

  export type ChatRoomUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutChatRoomNestedInput
  }

  export type ChatRoomUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reporter?: UserUpdateOneRequiredWithoutReportsSubmittedNestedInput
    roommate?: StudentProfileUpdateOneWithoutReportsNestedInput
  }

  export type ReportUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    roommateId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    roommateId?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason
    customReason?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyChatRoomInput = {
    id?: string
    senderId: string
    text: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type MessageUpdateWithoutChatRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutMessagesSentNestedInput
  }

  export type MessageUncheckedUpdateWithoutChatRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutChatRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}