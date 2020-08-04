import db from '../database/connection';
import convertHourToMin from '../utils/convertHourtoMin';
import { Request, Response } from 'express';

interface IScheduleItem{
  week_day: number;
  from: string;
  to: string;
 
}

export default class ClassesController{

  async index(request: Request, response: Response){
    const filters = request.query;

    const time = filters.time as string;
    const subject = filters.subject as string;
    const week_day = filters.week_day as string;

    if(!filters.subject || !filters.week_day || !filters.time) {
        return response.status(400).json({
          error: 'Missing filters search classes'
        })
    }
    const timeInMin = convertHourToMin(time);
    const classes = await db('classes')
      .whereExists(function(){
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMin])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMin])
          
      })    
      .where('classes.subject', '=', subject)
      .join('users','classes.user_id','=','users.id')
      .select(['classes.*', 'users.*'])

    return response.json(classes)
    
  }

  async create(request: Request , response: Response) {
    const {name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;
    const trx = await db.transaction();
  
    try {
     
      const insertedUsersIds = await trx('users').insert({
        name, avatar, whatsapp, bio,
      });
  
      const user_id = insertedUsersIds[0];
      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id,
      })
      const class_id = insertedClassesIds[0];
  
      const classSchedule = schedule.map((scheduleItem:IScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMin(scheduleItem.from),
          to: convertHourToMin(scheduleItem.to),
        };
      })
  
      await trx('class_schedule').insert(classSchedule);
      await trx.commit();
  
      return response.send();
    } catch (error) {
        await trx.rollback();
  
        return response.status(400).json({
        error: 'Unexpected error whitle creating new clss'
      })
      
    }
  }
}