/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.test = (function() {

    /**
     * Namespace test.
     * @exports test
     * @namespace
     */
    var test = {};

    test.TestReq = (function() {

        /**
         * Properties of a TestReq.
         * @memberof test
         * @interface ITestReq
         * @property {string|null} [name] TestReq name
         */

        /**
         * Constructs a new TestReq.
         * @memberof test
         * @classdesc Represents a TestReq.
         * @implements ITestReq
         * @constructor
         * @param {test.ITestReq=} [properties] Properties to set
         */
        function TestReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TestReq name.
         * @member {string} name
         * @memberof test.TestReq
         * @instance
         */
        TestReq.prototype.name = "";

        /**
         * Creates a new TestReq instance using the specified properties.
         * @function create
         * @memberof test.TestReq
         * @static
         * @param {test.ITestReq=} [properties] Properties to set
         * @returns {test.TestReq} TestReq instance
         */
        TestReq.create = function create(properties) {
            return new TestReq(properties);
        };

        /**
         * Encodes the specified TestReq message. Does not implicitly {@link test.TestReq.verify|verify} messages.
         * @function encode
         * @memberof test.TestReq
         * @static
         * @param {test.ITestReq} message TestReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified TestReq message, length delimited. Does not implicitly {@link test.TestReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof test.TestReq
         * @static
         * @param {test.ITestReq} message TestReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TestReq message from the specified reader or buffer.
         * @function decode
         * @memberof test.TestReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.TestReq} TestReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TestReq.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.test.TestReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TestReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof test.TestReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.TestReq} TestReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TestReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TestReq message.
         * @function verify
         * @memberof test.TestReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TestReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a TestReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof test.TestReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestReq} TestReq
         */
        TestReq.fromObject = function fromObject(object) {
            if (object instanceof $root.test.TestReq)
                return object;
            var message = new $root.test.TestReq();
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a TestReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof test.TestReq
         * @static
         * @param {test.TestReq} message TestReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.name = "";
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this TestReq to JSON.
         * @function toJSON
         * @memberof test.TestReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TestReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TestReq
         * @function getTypeUrl
         * @memberof test.TestReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TestReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/test.TestReq";
        };

        return TestReq;
    })();

    test.TestRes = (function() {

        /**
         * Properties of a TestRes.
         * @memberof test
         * @interface ITestRes
         * @property {string|null} [message] TestRes message
         */

        /**
         * Constructs a new TestRes.
         * @memberof test
         * @classdesc Represents a TestRes.
         * @implements ITestRes
         * @constructor
         * @param {test.ITestRes=} [properties] Properties to set
         */
        function TestRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TestRes message.
         * @member {string} message
         * @memberof test.TestRes
         * @instance
         */
        TestRes.prototype.message = "";

        /**
         * Creates a new TestRes instance using the specified properties.
         * @function create
         * @memberof test.TestRes
         * @static
         * @param {test.ITestRes=} [properties] Properties to set
         * @returns {test.TestRes} TestRes instance
         */
        TestRes.create = function create(properties) {
            return new TestRes(properties);
        };

        /**
         * Encodes the specified TestRes message. Does not implicitly {@link test.TestRes.verify|verify} messages.
         * @function encode
         * @memberof test.TestRes
         * @static
         * @param {test.ITestRes} message TestRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified TestRes message, length delimited. Does not implicitly {@link test.TestRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof test.TestRes
         * @static
         * @param {test.ITestRes} message TestRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TestRes message from the specified reader or buffer.
         * @function decode
         * @memberof test.TestRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {test.TestRes} TestRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TestRes.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.test.TestRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.message = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TestRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof test.TestRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {test.TestRes} TestRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TestRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TestRes message.
         * @function verify
         * @memberof test.TestRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TestRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a TestRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof test.TestRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {test.TestRes} TestRes
         */
        TestRes.fromObject = function fromObject(object) {
            if (object instanceof $root.test.TestRes)
                return object;
            var message = new $root.test.TestRes();
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a TestRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof test.TestRes
         * @static
         * @param {test.TestRes} message TestRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.message = "";
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this TestRes to JSON.
         * @function toJSON
         * @memberof test.TestRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TestRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TestRes
         * @function getTypeUrl
         * @memberof test.TestRes
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TestRes.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/test.TestRes";
        };

        return TestRes;
    })();

    return test;
})();

module.exports = $root;
