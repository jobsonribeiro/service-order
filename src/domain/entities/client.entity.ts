import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import { encrypt, decrypt } from './encryption.utils';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false, type: 'text', transformer: {
            to(value) {
                return encrypt(value);
            },
            from(value) {
                return decrypt(value);
            }
        }
    })
    name: string;

    @Column({
        nullable: false, type: 'text', transformer: {
            to(value) {
                return encrypt(value);
            },
            from(value) {
                return decrypt(value);
            }
        }
    })
    address: string;

    @Column({
        nullable: false, type: 'text', transformer: {
            to(value) {
                return encrypt(value);
            },
            from(value) {
                return decrypt(value);
            }
        }
    })
    phoneNumber: string;

    @BeforeInsert()
    @BeforeUpdate()
    encryptData() {
        if (this.name) this.name = encrypt(this.name);
        if (this.address) this.address = encrypt(this.address);
        if (this.phoneNumber) this.phoneNumber = encrypt(this.phoneNumber);
    }

    @AfterLoad()
    decryptData() {
        if (this.name) this.name = this.name;
        if (this.address) this.address = this.address;
        if (this.phoneNumber) this.phoneNumber = this.phoneNumber;
    }
}
