import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import fetch from "node-fetch";
import { DEFAULT_KEY_SIZE, POT_PUBLIC_KEY_URLS } from './rsa.constants';

@Injectable()
export class RsaService implements OnApplicationBootstrap {

  private readonly logger = new Logger(RsaService.name);

  private privateKey = process.env.PRIVATE_KEY;
  private publicKey = process.env.PUBLIC_KEY;
  private potPublicKey = process.env.POT_PUBLIC_KEY;

  /**
   * Ensures that public and private keys are available
   */
  async onApplicationBootstrap() {
    if (!this.privateKey || !this.publicKey) {
      this.logger.log("Keys not provided, generating new ones");
      crypto.generateKeyPair('rsa', {
        modulusLength: DEFAULT_KEY_SIZE,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      }, (err, pubKey, privKey) => {
        if (!err) {
          this.privateKey = privKey;
          this.publicKey = pubKey;
        } else {
          this.logger.error("Error generating keys", err.stack);
        }
      });
    }

    if (!this.potPublicKey) {
      const potEnvironment = process.env.POT_ENVIRONMENT || "sandbox";
      const potPublicKeyUrl = POT_PUBLIC_KEY_URLS.find(value => value.env === potEnvironment);
      if (!potPublicKeyUrl) {
        this.logger.error(`Invalid platofrm of trust environment: ${potEnvironment}`);
        return;
      }

      const res = await fetch(potPublicKeyUrl.url);
      this.potPublicKey = await res.text();
    }
  }

  /**
   * Returns public key
   */
  getPublicKey() {
    return this.publicKey;
  }

  /**
   * Returns private key
   */
  getPrivateKey() {
    return this.privateKey;
  }

  /**
   * Validates signature for given payload.
   *
   * @param {Object} body
   *   Payload to validate.
   * @param {String} signature
   *   Signature to validate.
   * @return {Boolean}
   *   True if signature is valid, false otherwise.
   */
  async verifySignature(body, signature) {
    const verifier = crypto.createVerify('sha256');
    verifier.update(this.stringifyBody(body));
    return verifier.verify(this.potPublicKey, signature, 'base64');
  }

/**
 * Generates signature object for given payload.
 *
 * @param {Object} body
 *   The payload to sign.
 * @return {String}
 *   The signature value.
 */
  async generateSignature(body) {
    let signatureValue;

    try {
      signatureValue = crypto
        .createSign('sha256')
        .update(this.stringifyBody(body))
        .sign(this.privateKey, 'base64');
    } catch (err) {
      this.logger.error("Error creating signature", err);
    }

    return signatureValue;
  }

  /**
   * Stringifies body object.
   *
   * @param {Object} body
   * @return {String}
   *   Stringified body.
   */
  private stringifyBody(body) {
    // Stringify sorted object.
    return JSON.stringify(this.sortObject(body))
      .replace(/[\u007F-\uFFFF]/g, chr => '\\u' + ('0000' + chr.charCodeAt(0)
        .toString(16)).substr(-4)).replace(new RegExp('":', 'g'), '": ')
      .trim();
  }

  /**
   * Sorts object recursively.
   *
   * @param {Object} object
   * @return {Object}
   *   Sorted object.
   */
  private sortObject(object) {
    let sortedObj = {};
    let keys = _.keys(object);
    keys = _.sortBy(keys, key => key);
    _.each(keys, key => {
      if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
        sortedObj[key] = this.sortObject(object[key]);
      } else {
        sortedObj[key] = object[key];
      }
    });
    return sortedObj;
  }

}