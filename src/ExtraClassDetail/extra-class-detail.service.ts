import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExtraClassDetail } from "./extra-class-detail.entity";

@Injectable()
export class ExtraClassDetailService {
    constructor(@InjectRepository(ExtraClassDetail) private readonly detailRepository: Repository<ExtraClassDetail>){}

    findAllDetails(id: string){
        return this.detailRepository.find({ExtraClassId: id})
    }

    findOne(classId: string, studentId: string){
        return this.detailRepository.findOne({ExtraClassId: classId, StudentId: studentId})
    }

    insertDetail(data: ExtraClassDetail){
        return this.detailRepository.save(data)
    }
};
