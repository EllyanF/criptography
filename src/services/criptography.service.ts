import crypto from 'crypto';
import { injectable } from 'inversify';

import { TransactionRecord } from '../types/transaction-record.type';

@injectable()
class CriptographyService {
    private algorithm = 'aes-256-cbc';
    private initVector = crypto.randomBytes(16);
    private securityKey = process.env.SECURITY_KEY as string;
    private fieldsToEncrypt = ['userDocument', 'creditCardToken'];

    public encrypt(record: TransactionRecord): TransactionRecord {
        return Object.fromEntries(
            Object.entries(record).map(([key, value]) => [
                key,
                this.fieldsToEncrypt.includes(key)
                    ? this.encryptField(value as string) : value
            ])
        ) as TransactionRecord;
    }

    public decryptAll(records: TransactionRecord[]): TransactionRecord[] {
        return records.map(record => {
            const decryptedRecord: any = { ...record };

            for (const key of this.fieldsToEncrypt) {
                const recordKey = key as keyof TransactionRecord['_doc'];
                const encryptedValue = decryptedRecord._doc[recordKey];

                if (typeof encryptedValue === 'string') {
                    decryptedRecord._doc[recordKey] = this.decryptField(encryptedValue);
                }
            }

            return decryptedRecord as TransactionRecord;
        });
    }

    private encryptField(value: string): string {
        const securityKey = this.securityKeyToBuffer();

        const cipher = crypto.createCipheriv(
            this.algorithm, securityKey, this.initVector
        );

        const ivToHex = this.initVector.toString('hex');
        const encryptedValue = cipher.update(value, 'utf-8', 'hex') + cipher.final('hex');

        return ivToHex + encryptedValue;
    }

    private decryptField(encrypted: string): string {
        const securityKey = this.securityKeyToBuffer();

        const initVector = Buffer.from(encrypted.slice(0, 32), 'hex');
        const encryptedField = Buffer.from(encrypted.slice(32), 'hex');

        const decipher = crypto.createDecipheriv(
            this.algorithm, securityKey, initVector
        );

        const decryptBinaryData = Buffer.concat([
            decipher.update(encryptedField),
            decipher.final()
        ]);

        const textDecoder = new TextDecoder();
        return textDecoder.decode(decryptBinaryData);
    }

    private securityKeyToBuffer(): Buffer {
        return Buffer.from(this.securityKey, 'base64');
    }
}

export default CriptographyService;