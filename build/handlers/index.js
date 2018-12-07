"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const carlsucks_1 = __importDefault(require("./carlsucks"));
const dank_1 = __importDefault(require("./dank"));
const help_1 = __importDefault(require("./help"));
const mymlan_1 = __importDefault(require("./mymlan"));
const prata_1 = __importDefault(require("./prata"));
const handlers = [dank_1.default, prata_1.default, carlsucks_1.default, mymlan_1.default];
exports.default = [...handlers, help_1.default(handlers)];
