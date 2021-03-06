import { Injectable, BadRequestException, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusTransaction } from 'src/status-transaction/status-transaction.entity';
import { User } from 'src/user/user.entity';
import { Between, getConnection, In, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import * as moment from 'moment';
import * as fs from 'fs'
import * as PdfPrinter from 'pdfmake'
import { Definition } from 'src/definition/definition.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction) private repository: Repository<Transaction>,
    ) { }
    async getAll() {
        try {
            const status = await this.getAllStatus()
            const user = await this.getAllUser()
            const list = await this.repository.find({
                where: {
                    createDate: Between(moment(Date.now()).format('yyyy-MM-DD') + ' 00:00:00', moment(Date.now()).format('yyyy-MM-DD') + ' 23:59:59')
                }
            })
            return list.map((e) => {
                return {
                    content: e.content,
                    createDate: e.createDate,
                    createdBy: e.createdBy,
                    fee: e.fee,
                    id: e.id,
                    receiverAccountNumber: e.receiverAccountNumber,
                    receiverBank: e.receiverBank,
                    receiverName: e.receiverName,
                    receiverPhone: e.receiverPhone,
                    senderAddress: e.senderAddress,
                    senderName: e.senderName,
                    senderPhone: e.senderPhone,
                    statusTransactionID: e.statusTransactionID,
                    transferAmount: e.transferAmount,
                    transferBy: e.transferBy,
                    transferDate: e.transferDate,
                    statusTransactionName: status.filter((ea) => ea.id == e.statusTransactionID).map((e) => e.name).join(),
                    userCreateName: user.filter((ea) => ea.id == e.createdBy).map((e) => e.name).join(),
                    userTransferName: user.filter((ea) => ea.id == e.transferBy).map((e) => e.name).join(),
                }
            });
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async printBill(idCreate: number, id: number,res) {
        const fonts = {
            Roboto: {
                normal: 'fonts/Roboto-Regular.ttf',
                bold: 'fonts/Roboto-Medium.ttf',
                italics: 'fonts/Roboto-Italic.ttf',
                bolditalics: 'fonts/Roboto-MediumItalic.ttf'
            }
        };
        const pdfmake = new PdfPrinter(fonts)
        const model = await this.repository.findOne({
            where: [{ id: id }],
            loadRelationIds: true
        })
        const user = await this.getAllUser()
        const userCreateName = user.filter((ea) => ea.id == idCreate).map((e) => e.name).join()
        const definition = await this.getAllDefinion()
        const dd = {
            content: [
                {
                    columns: [
                        {
                            width: '10%',
                            alignment: 'center',
                            columns: [
                                {
                                    image: 'imgpsh_fullsize_anim.png',
                                    width: 60,
                                    height: 60,
                                },
                            ]
                        },
                        [
                            {
                                width: '80%',
                                alignment: 'center',
                                text: 'C???NG H??A X?? H???I CH??? NGH??A VI???T NAM',
                                fontSize: 13,
                            },
                            {
                                width: '80%',
                                alignment: 'center',
                                text: '?????c L???p - T??? Do - H???nh Ph??c',
                                fontSize: 11,
                            },
                            {
                                width: '80%',
                                alignment: 'center',
                                fontSize: 11,
                                text: `M?? c???a h??ng/?????i l??: ${definition.filter((e)=>e.name=='macuahang').map((e)=>e.value).join('')}`
                            },
                            {
                                width: '80%',
                                alignment: 'center',
                                fontSize: 11,
                                text: `T??n c???a h??ng/?????i l??: ${definition.filter((e)=>e.name=='tencuahang').map((e)=>e.value).join('')}`
                            },
                            {
                                width: '80%',
                                alignment: 'center',
                                fontSize: 11,
                                text: `D??: ${definition.filter((e)=>e.name=='phone').map((e)=>e.value).join('')}`
                            },
                        ],
                        {
                            width: '10%',
                            alignment: 'center',
                            text: ''
                        },
                    ]
                },
                {
                    italics: true,
                    width: '100%',
                    alignment: 'center',
                    fontSize: 10,
                    bold: true,
                    text: 'L??u ??: Tr?????ng h???p GD n???p ti???n li??n ng??n h??ng b??? l???i, Viettel s??? ti???p nh???n v?? x??? l?? trong 04 ng??y l??m vi???c, tr??? ng??y l???, T7&CN, Tr?????ng h???p GD chuy???n ti???n, N???p ti???n(MB, ViettelPay, BaoVietPay) b??? l???i, Viettel s??? h??? tr??? v?? x??? l?? v??o ng??y l??m vi???c ti???p theo.'
                },
                {
                    margin: [0, 5],
                    text: 'N???P TI???N V??O T??I KHO???N QUA BANKNET',
                    alignment: 'center',
                    fontSize: 18,
                    bold: true,
                },
                {
                    width: '100%',
                    alignment: 'center',
                    fontSize: 10,
                    text: `Ng??y: ${moment(model.createDate).format('DD/MM/yyyy')}`
                },
                {
                    margin: [0, 5],
                    text: 'TH??NG TIN NG?????I N???P',
                    fontSize: 14,
                    bold: true,
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `H??? v?? t??n kh??ch h??ng: ${model.senderName}`,
                        },
                        {
                            width: '50%',
                            text: `??i???n tho???i: ${model.senderName}`
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `?????a ch??? li??n h???: ${model.senderAddress}`,
                        },
                        {
                            width: '50%',
                            text: ''
                        },
                    ]
                },
                {
                    margin: [0, 5],
                    text: 'TH??NG TIN NG?????I NH???N',
                    fontSize: 14,
                    bold: true,
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `S??? th???/S??? t??i kho???n: ${model.receiverAccountNumber}`,
                        },
                        {
                            width: '50%',
                            text: `S??? ??i???n tho???i: ${model.receiverPhone}`
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `H??? v?? t??n ng?????i nh???n: ${model.receiverName}`,
                        },
                        {
                            width: '50%',
                            text: ''
                        },
                    ]
                },
                {
                    margin: [0, 5],
                    text: 'N???I DUNG TI???N N???P',
                    fontSize: 14,
                    bold: true,
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `S??? ti???n b???ng s???: ${model.transferAmount}`,
                            fontSize: 10,
                        },
                        {
                            width: '50%',
                            text: `S??? ti???n b???ng ch???: ${model.transferAmount}`,
                            fontSize: 10,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `Ph?? giao d???ch: ${model.fee}`,
                            fontSize: 10,
                        },
                        {
                            width: '50%',
                            text: ''
                        },
                    ]
                },
                {
                    width: '100%',
                    fontSize: 13,
                    text: `N???i dung: ${model.content}`
                },
                {
                    width: 'auto',
                    alignment: 'center',
                    text: 'T??i ???? ki???m tra v?? ?????ng ?? ho??n to??n v???i n???i dung tr??n phi???u.',
                    fontSize: 10,
                    bold: true,
                },
                {
                    alignment: 'center',
                    columns: [
                        {
                            width: '40%',
                            alignment: 'center',
                            fontSize: 10,
                            text: 'Kh??ch h??ng',
                        },
                        {
                            width: '20%',
                            text: ''
                        },
                        {
                            width: '40%',
                            alignment: 'center',
                            fontSize: 10,
                            text: 'Giao d???ch vi??n'
                        },
                    ]
                },
                {
                    alignment: 'center',
                    columns: [
                        {
                            width: '40%',
                            alignment: 'center',
                            fontSize: 10,
                            text: '\n\n\n\n',
                        },
                        {
                            width: '20%',
                            text: ''
                        },
                        {
                            width: '40%',
                            alignment: 'center',
                            fontSize: 10,
                            text: `\n\n\n\n${userCreateName}`
                        },
                    ]
                },
            ],
        }
        let chunks = []
        var pdfDoc = pdfmake.createPdfKitDocument(dd, {});
        const file = fs.createWriteStream('document.pdf')
        // pdfDoc.pipe(file);
        pdfDoc.on('data', (chunk) => chunks.push(chunk))
        pdfDoc.on('end',()=>{
            const buffer = Buffer.concat(chunks)
            res.send(buffer)
        })
        pdfDoc.end();
        // pdfDoc.close()
        // const file = fs.createReadStream('document.pdf')
        // file.pipe(pdfDoc)
        // return new StreamableFile(Buffer.from(pdfDoc.toString('utf-8'), 'base64'));
        // return new StreamableFile(fs.createReadStream(join(process.cwd(), 'document.pdf')));
    }
    async getFilter(from: string, to: string, _status: number) {
        try {
            const status = await this.getAllStatus()
            const user = await this.getAllUser()
            const between = Between(from + ' 00:00:00', to + ' 23:59:59')
            const filter = `${_status}` === `${0}` ? In([1, 2]) : _status
            const list = await this.repository.find({
                where: {
                    createDate: between,
                    statusTransactionID: filter
                }
            })
            return list.map((e) => {
                return {
                    content: e.content,
                    createDate: e.createDate,
                    createdBy: e.createdBy,
                    fee: e.fee,
                    id: e.id,
                    receiverAccountNumber: e.receiverAccountNumber,
                    receiverBank: e.receiverBank,
                    receiverName: e.receiverName,
                    receiverPhone: e.receiverPhone,
                    senderAddress: e.senderAddress,
                    senderName: e.senderName,
                    senderPhone: e.senderPhone,
                    statusTransactionID: e.statusTransactionID,
                    transferAmount: e.transferAmount,
                    transferBy: e.transferBy,
                    transferDate: e.transferDate,
                    statusTransactionName: status.filter((ea) => ea.id == e.statusTransactionID).map((e) => e.name).join(),
                    userCreateName: user.filter((ea) => ea.id == e.createdBy).map((e) => e.name).join(),
                    userTransferName: user.filter((ea) => ea.id == e.transferBy).map((e) => e.name).join(),
                }
            });
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async getById(id: number) {
        try {
            const status = await this.getAllStatus()
            const user = await this.getAllUser()
            const model = await this.repository.findOne({
                where: [{ id: id }],
                loadRelationIds: true
            })
            return {
                content: model.content,
                createDate: model.createDate,
                createdBy: model.createdBy,
                fee: model.fee,
                id: model.id,
                receiverAccountNumber: model.receiverAccountNumber,
                receiverBank: model.receiverBank,
                receiverName: model.receiverName,
                receiverPhone: model.receiverPhone,
                senderAddress: model.senderAddress,
                senderName: model.senderName,
                senderPhone: model.senderPhone,
                statusTransactionID: model.statusTransactionID,
                transferAmount: model.transferAmount,
                transferBy: model.transferBy,
                transferDate: model.transferDate,
                statusTransactionName: status.filter((ea) => ea.id == model.statusTransactionID).map((e) => e.name).join(),
                userCreateName: user.filter((ea) => ea.id == model.createdBy).map((e) => e.name).join(),
                userTransferName: user.filter((ea) => ea.id == model.transferBy).map((e) => e.name).join(),
            }
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }

    async create(model: Transaction) {
        const data = await this.getByCode('created')
        console.log(data)
        const userDb = await this.repository.save({
            ...model,
            statusTransactionID: data.id
        })
        return userDb
    }
    async updateStatus(id: number, model: Transaction) {
        const userDb = await this.repository.findOneOrFail({ id: id })
        if (!userDb) throw new NotFoundException('id not found')
        try {
            const data = await this.getByCode('tranfered')
            return await this.repository.save({
                id: id,
                transferBy: model.transferBy,
                transferDate: model.transferDate,
                statusTransactionID: data.id
            })
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async update(id: number, model: Transaction) {
        const userDb = await this.repository.findOneOrFail({ id: id })
        if (!userDb) throw new NotFoundException('id not found')
        try {
            return await this.repository.save({
                id: id,
                ...model,
            })
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async delete(id: number) {
        const userDb = await this.repository.findOneOrFail({ id: id })
        if (!userDb) throw new NotFoundException('id not found')
        try {
            return await this.repository.delete({
                id: id,
            })
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }

    async getByCode(code: string) {
        try {
            return await getConnection()
                .getRepository(StatusTransaction)
                .findOne({ code })
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async getAllStatus() {
        try {
            return await getConnection()
                .getRepository(StatusTransaction)
                .find({})
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async getAllUser() {
        try {
            return await getConnection()
                .getRepository(User)
                .find({})
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }

    async getAllDefinion() {
        try {
            return await getConnection()
                .getRepository(Definition)
                .find({})
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
}
