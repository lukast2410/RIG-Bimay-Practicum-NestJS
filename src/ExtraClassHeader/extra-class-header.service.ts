import { Injectable, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, In, LessThan, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { ExtraClassHeader } from "./extra-class-header.entity";

@Injectable()
export class ExtraClassHeaderService {
    constructor(@InjectRepository(ExtraClassHeader) private readonly headerRepository: Repository<ExtraClassHeader>){}

    findAllExtraClass(){
        return this.headerRepository.find()
    }

    findAstExtraClassToday(date: Date, ast: String){
        return this.headerRepository.find({
            where: [
                {ExtraClassDate: date, Assistant1: ast},
                {ExtraClassDate: date, Assistant2: ast},
            ],
            order: {
                Course: 'ASC'
            },
        })
    }

    findNotRecordedAstExtraClass(date: Date, ast: String, shift: number){
        return this.headerRepository.createQueryBuilder("header")
            .where(new Brackets(b => {
                b.where("ExtraClassDate < :date", { date: date })
                    .orWhere(new Brackets(q => {
                        q.where("ExtraClassDate = :date", { date: date })
                            .andWhere("Shift < :shift", { shift: shift })
                    }))
            }))
            .andWhere(new Brackets(b => {
                b.where("Assistant1 = :ast1", { ast1: ast })
                    .orWhere("Assistant2 = :ast2", { ast2: ast })
            }))
            .andWhere("LinkRecord = :record", { record: '' })
            .orderBy("Course", "ASC")
            .getMany()
    }

    findAllExtraClassToday(date: Date){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: date
            },
            order: {
                Course: 'ASC'
            }
        })
    }

    findAllExtraClassUpcoming(date: Date){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: MoreThan(date)
            },
            order: {
                Course: 'ASC'
            }
        })
    }

    findAllExtraClassPrevious(date: Date){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: LessThan(date)
            },
            order: {
                Course: 'ASC'
            }
        })
    }

    findSubjectExtraClassToday(course: string[], date){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: date,
                Course: In(course)
            },
            order: {
                Course: 'ASC'
            }
        })
    }

    findSubjectExtraClassUpcoming(course: string[], date){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: MoreThan(date),
                Course: In(course)
            },
            order: {
                Course: 'ASC'
            }
        })
    }

    findSubjectExtraClassPrevious(course: string[], date){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: LessThan(date),
                Course: In(course)
            },
            order: {
                Course: 'ASC'
            }
        })
    }

    findExtraClass(id: string){
        return this.headerRepository.findOne({
            where: {ExtraClassId: id},
            relations: ['details']
        })
    }

    insertExtraClass(extraClass: ExtraClassHeader){
        return this.headerRepository.save(extraClass)
    }

    updateExtraClass(id: string, extraClass: ExtraClassHeader){
        return this.headerRepository.save({...extraClass, ExtraClassId: id})
    }

    deleteExtraClass(id: string){
        return this.headerRepository.delete({ExtraClassId: id})
    }
};
