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

    findAstExtraClassToday(date: Date, ast: String, shift: number){
        return this.headerRepository.createQueryBuilder()
            .where("ExtraClassDate = :date", {date: date})
            .andWhere(new Brackets(b => {
                b.where("Assistant1 = :ast1", {ast1: ast})
                    .orWhere("Assistant2 = :ast2", {ast2: ast})
            }))
            .orderBy(`(CASE WHEN Shift=${shift} THEN 1 ELSE 2 END)`, 'ASC')
            .addOrderBy('Course', 'ASC')
            .getMany()
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
            .orderBy("ExtraClassDate", "DESC")
            .addOrderBy("Course", "ASC")
            .getMany()
    }

    findAllExtraClassToday(date: Date, shift: number, semesterId: string){
        return this.headerRepository.createQueryBuilder()
            .where("ExtraClassDate = :date", {date: date})
            .andWhere("SemesterId = :semesterId", {semesterId: semesterId})
            .orderBy(`(CASE WHEN Shift=${shift} THEN 1 ELSE 2 END)`, 'ASC')
            .addOrderBy('Course', 'ASC')
            .getMany()
    }

    findAllExtraClassUpcoming(date: Date, semesterId: string){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: MoreThan(date),
                SemesterId: semesterId
            },
            order: {
                ExtraClassDate: 'ASC',
                Course: 'ASC'
            }
        })
    }

    findAllExtraClassPrevious(date: Date, semesterId: string){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: LessThan(date),
                SemesterId: semesterId
            },
            order: {
                ExtraClassDate: 'DESC',
                Course: 'ASC'
            }
        })
    }

    findSubjectExtraClassToday(course: string[], date: Date, shift: number, semesterId: string){
        return this.headerRepository.createQueryBuilder()
            .where("ExtraClassDate = :date", {date: date})
            .andWhere("SemesterId = :semesterId", {semesterId: semesterId})
            .andWhere("Course IN (:...course)", { course: course })
            .orderBy(`(CASE WHEN Shift=${shift} THEN 1 ELSE 2 END)`, 'ASC')
            .addOrderBy('Course', 'ASC')
            .getMany()
    }

    findSubjectExtraClassUpcoming(course: string[], date: Date, semesterId: string){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: MoreThan(date),
                SemesterId: semesterId,
                Course: In(course)
            },
            order: {
                ExtraClassDate: 'ASC',
                Course: 'ASC'
            }
        })
    }

    findSubjectExtraClassPrevious(course: string[], date: Date, semesterId: string){
        return this.headerRepository.find({
            where: {
                ExtraClassDate: LessThan(date),
                SemesterId: semesterId,
                Course: In(course)
            },
            order: {
                ExtraClassDate: 'DESC',
                Course: 'ASC'
            }
        })
    }

    findExtraClass(id: string){
        return this.headerRepository.createQueryBuilder('header')
            .where("header.ExtraClassId = :id", {id: id})
            .leftJoinAndSelect('header.details', 'ExtraClassDetail')
            .orderBy('Status', 'DESC')
            .addOrderBy('InsideStudent', 'DESC')
            .getOne()
    }

    findExtraClassInSemester(id: string, semesterId: string){
        return this.headerRepository.createQueryBuilder('header')
            .where("header.ExtraClassId = :id", {id: id})
            .andWhere("SemesterId = :semesterId", {semesterId: semesterId})
            .leftJoinAndSelect('header.details', 'ExtraClassDetail')
            .orderBy('Status', 'DESC')
            .addOrderBy('InsideStudent', 'DESC')
            .getOne()
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
