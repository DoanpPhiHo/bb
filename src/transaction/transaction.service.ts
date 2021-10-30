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
                                text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                                fontSize: 13,
                            },
                            {
                                width: '80%',
                                alignment: 'center',
                                text: 'Độc Lập - Tự Do - Hạnh Phúc',
                                fontSize: 11,
                            },
                            {
                                width: '80%',
                                alignment: 'center',
                                fontSize: 11,
                                text: `Mã cửa hàng/Đại lý: ${definition.filter((e)=>e.name=='macuahang').map((e)=>e.value).join('')}`
                            },
                            {
                                width: '80%',
                                alignment: 'center',
                                fontSize: 11,
                                text: `Tên cửa hàng/Đại lý: ${definition.filter((e)=>e.name=='tencuahang').map((e)=>e.value).join('')}`
                            },
                            {
                                width: '80%',
                                alignment: 'center',
                                fontSize: 11,
                                text: `DĐ: ${definition.filter((e)=>e.name=='phone').map((e)=>e.value).join('')}`
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
                    text: 'Lưu ý: Trường hợp GD nạp tiền liên ngân hàng bị lỗi, Viettel sẽ tiếp nhận và xử lý trong 04 ngày làm việc, trừ ngày lễ, T7&CN, Trường hợp GD chuyển tiền, Nạp tiền(MB, ViettelPay, BaoVietPay) bị lỗi, Viettel sẽ hỗ trợ và xử lý vào ngày làm việc tiếp theo.'
                },
                {
                    margin: [0, 5],
                    text: 'NẠP TIỀN VÀO TÀI KHOẢN QUA BANKNET',
                    alignment: 'center',
                    fontSize: 18,
                    bold: true,
                },
                {
                    width: '100%',
                    alignment: 'center',
                    fontSize: 10,
                    text: `Ngày: ${moment(model.createDate).format('DD/MM/yyyy')}`
                },
                {
                    margin: [0, 5],
                    text: 'THÔNG TIN NGƯỜI NẠP',
                    fontSize: 14,
                    bold: true,
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `Họ và tên khách hàng: ${model.senderName}`,
                        },
                        {
                            width: '50%',
                            text: `Điện thoại: ${model.senderName}`
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `Địa chỉ liên hệ: ${model.senderAddress}`,
                        },
                        {
                            width: '50%',
                            text: ''
                        },
                    ]
                },
                {
                    margin: [0, 5],
                    text: 'THÔNG TIN NGƯỜI NHẬN',
                    fontSize: 14,
                    bold: true,
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `Số thẻ/Số tài khoản: ${model.receiverAccountNumber}`,
                        },
                        {
                            width: '50%',
                            text: `Số điện thoại: ${model.receiverPhone}`
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `Họ và tên người nhận: ${model.receiverName}`,
                        },
                        {
                            width: '50%',
                            text: ''
                        },
                    ]
                },
                {
                    margin: [0, 5],
                    text: 'NỘI DUNG TIỀN NẠP',
                    fontSize: 14,
                    bold: true,
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `Số tiền bằng số: ${model.transferAmount}`,
                            fontSize: 10,
                        },
                        {
                            width: '50%',
                            text: `Số tiền bằng chữ: ${model.transferAmount}`,
                            fontSize: 10,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: `Phí giao dịch: ${model.fee}`,
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
                    text: `Nội dung: ${model.content}`
                },
                {
                    width: 'auto',
                    alignment: 'center',
                    text: 'Tôi đã kiểm tra và đồng ý hoàn toàn với nội dung trên phiếu.',
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
                            text: 'Khách hàng',
                        },
                        {
                            width: '20%',
                            text: ''
                        },
                        {
                            width: '40%',
                            alignment: 'center',
                            fontSize: 10,
                            text: 'Giao dịch viên'
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
