import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Request, Res, UnauthorizedException } from "@nestjs/common";
import axios from "axios";
import { checkAstToken, checkCollabToken, checkStudentToken } from "src/api/check-auth";
import { ExtraClassDetail } from "src/ExtraClassDetail/extra-class-detail.entity";
import { ExtraClassDetailService } from "src/ExtraClassDetail/extra-class-detail.service";
import { Notification } from "src/Notification/notification.entity";
import { NotificationService } from "src/Notification/notification.service";
import { NotificationDetailService } from "src/NotificationDetail/notification-detail.service";
import { ExtraClassHeader } from "./extra-class-header.entity";
import { ExtraClassHeaderService } from "./extra-class-header.service";
import { v4 as uuid } from 'uuid'
import { formatDate, listShift } from "src/api/helper";
import { NotificationDetail } from "src/NotificationDetail/notification-detail.entity";
import { PushService } from "src/WebPush/push.service";

const getStudents = `https://laboratory.binus.ac.id/lapi/api/ClassTransaction/GetClassTransactionStudents?classTransactionId=`

@Controller('ExtraClassHeader')
export class ExtraClassHeaderController {
    constructor(private readonly headerService: ExtraClassHeaderService, private readonly detailService: ExtraClassDetailService, private readonly notificationService: NotificationService, private readonly notifDetailService: NotificationDetailService, private readonly pushService: PushService){}

    @Get('InSemester/:SemesterId')
    async getAllExtraClass(@Request() req, @Param('SemesterId') semesterId: string){
        const auth = await checkAstToken(req.headers.authorization)
        if(auth != null){
            const now = new Date()
            const hour = now.getHours()
            const shift = (hour - 5) / 2
            now.setHours(0, 0, 0, 0)
            return {
                today: await this.headerService.findAllExtraClassToday(now, shift, semesterId),
                upcoming: await this.headerService.findAllExtraClassUpcoming(now, semesterId),
                previous: await this.headerService.findAllExtraClassPrevious(now, semesterId)
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Get('Assistant/:Initial')
    async findAstExtraClass(@Request() req, @Param('Initial') initial: string){
        const auth = await checkAstToken(req.headers.authorization)
        if(auth != null){
            const now = new Date()
            const hour = now.getHours()
            const shift = (hour - 5) / 2
            now.setHours(0, 0, 0, 0)
            return {
                today: await this.headerService.findAstExtraClassToday(now, initial, shift),
                no_record: await this.headerService.findNotRecordedAstExtraClass(now, initial, shift)
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Post('StudentRecent')
    async findStudentExtraClass(@Request() req, @Body('SemesterId') semesterId, @Body('Courses') courses: any[]){
        const auth = await checkStudentToken(req.headers.authorization)
        if(auth != null){
            const now = new Date()
            now.setHours(0, 0, 0, 0)
            const course = []
            const classes = []
            courses.forEach(x => {
                course.push(x.Subject)
                classes.push(x.Class)
            })
            return {
                data: await this.headerService.findRecentStudentExtraClass(now, course, classes, semesterId)
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Get('Courses/:SemesterId/:Courses')
    async findSubjectsExtraClass(@Request() req, @Param('SemesterId') semesterId: string, @Param('Courses') courses: string){
        const auth = await checkStudentToken(req.headers.authorization)
        if(auth != null){
            const now = new Date()
            const hour = now.getHours()
            const shift = (hour - 5) / 2
            now.setHours(0, 0, 0, 0)
            const ids = courses.split(',')
            return { 
                today: await this.headerService.findSubjectExtraClassToday(ids, now, shift, semesterId),
                upcoming: await this.headerService.findSubjectExtraClassUpcoming(ids, now, semesterId),
                previous: await this.headerService.findSubjectExtraClassPrevious(ids, now, semesterId)
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Get(':id')
    async findExtraClass(@Request() req, @Param('id') id: string){
        const auth = await checkCollabToken(req.headers.authorization)
        if(auth != null){
            let data = await this.headerService.findExtraClassInSemester(id);
            if(data == null){
                throw new NotFoundException({ message: 'ID not found! '})
            }
            return {
                data
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Post()
    async insertExtraClass(@Request() req, @Body('ExtraClass') extraClass: ExtraClassHeader, @Body('ClassTransactionId') classId: string){
        const auth = await checkAstToken(req.headers.authorization)
        if(auth != null){
            const students = await axios.get(getStudents + classId, {
                headers: {
                    authorization: req.headers.authorization
                }
            }).then(res => res.data)
            extraClass.TotalStudent = students.length
            const studentsData: ExtraClassDetail[] = students.map(x => {
                return {
                    ExtraClassId: extraClass.ExtraClassId,
                    StudentId: x.Number,
                    StudentName: x.Name,
                    Status: 'Absent',
                    InsideStudent: true
                }
            })
            extraClass.details = studentsData
            const temp = await this.headerService.insertExtraClass(extraClass)
            const notifId = uuid()
            const notifDetailData: NotificationDetail[] = students.map(x => {
                return {
                    NotificationId: notifId,
                    StudentId: x.Number,
                    StudentName: x.Name,
                    IsRead: false
                }
            }) 
            notifDetailData.push({
                NotificationId: notifId,
                StudentId: temp.Assistant1,
                StudentName: temp.Assistant1,
                IsRead: false
            })
            notifDetailData.push({
                NotificationId: notifId,
                StudentId: temp.Assistant2,
                StudentName: temp.Assistant2,
                IsRead: false
            })
            const notifData: Notification = {
                NotificationId: notifId,
                SemesterId: temp.SemesterId,
                Title: `${extraClass.Class.trim()} Extra Class`,
                Content: `${extraClass.Course} Extra Class schedule changed to ${formatDate(new Date(extraClass.ExtraClassDate))}, ${listShift[extraClass.Shift - 1].Name}`,
                ContentId: temp.ExtraClassId,
                Type: `ExtraClass`,
                LastUpdate: new Date(),
                details: notifDetailData
            }
            const notifResult = await this.notificationService.insertNotification(notifData)
            const result = this.pushService.sendNotificationToUsers(notifResult)
            return {
                Notification: notifResult
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Put(':id')
    async updateExtraClass(@Request() req, @Param('id') id: string, @Body() extraClass: ExtraClassHeader){
        const auth = await checkAstToken(req.headers.authorization)
        if(auth != null){
            const temp = await this.headerService.findExtraClass(id)
            if(temp == null){
                throw new NotFoundException({ message: 'ID not found! '})
            }
            const data = await this.headerService.updateExtraClass(id, extraClass)
            if(extraClass.ExtraClassDate != temp.ExtraClassDate || extraClass.Shift != temp.Shift){
                // ! update notif
                let notif = await this.notificationService.findNotificationByContentId(temp.ExtraClassId)
                if(notif){
                    notif.Content =  `${temp.Course} New Extra Class will be held on ${formatDate(new Date(extraClass.ExtraClassDate))}, ${listShift[extraClass.Shift - 1].Name}`
                    notif.LastUpdate = new Date()
                    let updated = await this.notificationService.updateNotification(notif.NotificationId, notif)
                    let detailUpdate = await this.notifDetailService.updateNotificationRead(notif.NotificationId, false)
                    let result = this.pushService.sendNotificationToUsers(updated)
                    return {
                        data: await this.notificationService.findNotification(notif.NotificationId),
                        PushNotification: true
                    }
                }
            }
            return { data, PushNotification: false }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Post('StartAbsent')
    async startAbsent(@Request() req, @Body('ExtraClassId') id: string){
        const auth = await checkAstToken(req.headers.authorization)
        if(auth != null){
            let temp = await this.headerService.findExtraClass(id)
            if(temp == null){
                throw new NotFoundException({ message: 'ID not found! '})
            }
            temp.StartAbsent = new Date()
            let result = await this.headerService.updateExtraClass(id, temp)
            return {
                StartAbsent: result.StartAbsent
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }

    @Delete(':id')
    async deleteExtraClass(@Request() req, @Param('id') id: string){
        const auth = await checkAstToken(req.headers.authorization)
        if(auth != null){
            let temp = await this.headerService.deleteExtraClass(id)
            if(temp.affected == 0){
                throw new NotFoundException({ message: 'ID not found! '})
            }
            let notif = await this.notificationService.deleteNotificationByContentId(id)
            return {
                ExtraClass: temp,
                Notification: notif
            }
        }else{
            throw new UnauthorizedException({ message: 'Authorization has been denied for this request.' })
        }
    }
};
