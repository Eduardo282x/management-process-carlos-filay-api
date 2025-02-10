import { IsNumber, IsString } from "class-validator";

export class DtoGrade {
    @IsString()
    grade: string;
}

export class DtoUpdateGrade extends DtoGrade {
    @IsNumber()
    id: number;
}

export class DtoSubjects {
    @IsNumber()
    gradeId: number;
    @IsString()
    subject: string;
}

export class DtoUpdateSubjects extends DtoSubjects {
    @IsNumber()
    id: number;
}


export class DtoActivities {
    @IsNumber()
    subjectId: number;
    @IsString()
    activity: string;
}

export class DtoUpdateActivities extends DtoActivities {
    @IsNumber()
    id: number;
}

export class DtoNotes {
    @IsNumber()
    activityId: number;
    @IsNumber()
    studentId: number;
    @IsNumber()
    note: number;
}

export class DtoUpdateNotes extends DtoNotes {
    @IsNumber()
    id: number;
}