import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace test. */
export namespace test {

    /** Represents a Test */
    class Test extends $protobuf.rpc.Service {

        /**
         * Constructs a new Test service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new Test service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Test;

        /**
         * Calls SayTest.
         * @param request TestReq message or plain object
         * @param callback Node-style callback called with the error, if any, and TestRes
         */
        public sayTest(request: test.ITestReq, callback: test.Test.SayTestCallback): void;

        /**
         * Calls SayTest.
         * @param request TestReq message or plain object
         * @returns Promise
         */
        public sayTest(request: test.ITestReq): Promise<test.TestRes>;
    }

    namespace Test {

        /**
         * Callback as used by {@link test.Test#sayTest}.
         * @param error Error, if any
         * @param [response] TestRes
         */
        type SayTestCallback = (error: (Error|null), response?: test.TestRes) => void;
    }

    /** Properties of a TestReq. */
    interface ITestReq {

        /** TestReq name */
        name?: (string|null);
    }

    /** Represents a TestReq. */
    class TestReq implements ITestReq {

        /**
         * Constructs a new TestReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: test.ITestReq);

        /** TestReq name. */
        public name: string;

        /**
         * Creates a new TestReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TestReq instance
         */
        public static create(properties?: test.ITestReq): test.TestReq;

        /**
         * Encodes the specified TestReq message. Does not implicitly {@link test.TestReq.verify|verify} messages.
         * @param message TestReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: test.ITestReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TestReq message, length delimited. Does not implicitly {@link test.TestReq.verify|verify} messages.
         * @param message TestReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: test.ITestReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TestReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TestReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): test.TestReq;

        /**
         * Decodes a TestReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TestReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): test.TestReq;

        /**
         * Verifies a TestReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TestReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TestReq
         */
        public static fromObject(object: { [k: string]: any }): test.TestReq;

        /**
         * Creates a plain object from a TestReq message. Also converts values to other types if specified.
         * @param message TestReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: test.TestReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TestReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TestReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TestRes. */
    interface ITestRes {

        /** TestRes message */
        message?: (string|null);
    }

    /** Represents a TestRes. */
    class TestRes implements ITestRes {

        /**
         * Constructs a new TestRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: test.ITestRes);

        /** TestRes message. */
        public message: string;

        /**
         * Creates a new TestRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TestRes instance
         */
        public static create(properties?: test.ITestRes): test.TestRes;

        /**
         * Encodes the specified TestRes message. Does not implicitly {@link test.TestRes.verify|verify} messages.
         * @param message TestRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: test.ITestRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TestRes message, length delimited. Does not implicitly {@link test.TestRes.verify|verify} messages.
         * @param message TestRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: test.ITestRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TestRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TestRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): test.TestRes;

        /**
         * Decodes a TestRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TestRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): test.TestRes;

        /**
         * Verifies a TestRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TestRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TestRes
         */
        public static fromObject(object: { [k: string]: any }): test.TestRes;

        /**
         * Creates a plain object from a TestRes message. Also converts values to other types if specified.
         * @param message TestRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: test.TestRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TestRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TestRes
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
