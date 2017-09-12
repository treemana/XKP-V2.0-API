# 1. XKP-V2.0-API

<!-- TOC -->

- [1. XKP-V2.0-API](#1-xkp-v20-api)
  - [1.1. tips](#11-tips)
  - [1.2. function](#12-function)
  - [1.3. 学院管理](#13-学院管理)
    - [1.3.1. 添加学院](#131-添加学院)
    - [1.3.2. 查询学院](#132-查询学院)
    - [1.3.3. 查询学院名称](#133-查询学院名称)
    - [1.3.4. 删除学院](#134-删除学院)
  - [1.4. 管理员设置](#14-管理员设置)
    - [1.4.1. 添加管理员](#141-添加管理员)
    - [1.4.2. 查询管理员](#142-查询管理员)
    - [1.4.3. 重置密码](#143-重置密码)
    - [1.4.4. 修改密码](#144-修改密码)
    - [1.4.5. 删除管理员](#145-删除管理员)
  - [1.5. 登录设置](#15-登录设置)
    - [1.5.1. 登录](#151-登录)
    - [1.5.2. 登录控制](#152-登录控制)
  - [1.6. 数据管理](#16-数据管理)
    - [1.6.1. 添加年级](#161-添加年级)
    - [1.6.2. 查询年级](#162-查询年级)
    - [1.6.3. 删除年级](#163-删除年级)
    - [1.6.4. 开启新学期*](#164-开启新学期)
  - [1.7. 大表查询*](#17-大表查询)
    - [1.7.1. 查看大表](#171-查看大表)
    - [1.7.2. 下载大表](#172-下载大表)
  - [1.8. 专业管理](#18-专业管理)
    - [1.8.1. 添加专业](#181-添加专业)
    - [1.8.2. 查询专业](#182-查询专业)
    - [1.8.3. 删除专业](#183-删除专业)
  - [1.9. 班级管理](#19-班级管理)
    - [1.9.1. 添加班级](#191-添加班级)
    - [1.9.2. 查询班级](#192-查询班级)
    - [1.9.3. 删除班级](#193-删除班级)
  - [1.10. 班级成员](#110-班级成员)
    - [1.10.1. 添加学生](#1101-添加学生)
    - [1.10.2. 查询学生](#1102-查询学生)
    - [1.10.3. 删除学生](#1103-删除学生)
  - [1.11. 基本加分](#111-基本加分)
    - [1.11.1. 查询基本加分](#1111-查询基本加分)
    - [1.11.2. 修改基本加分](#1112-修改基本加分)
  - [1.12. 课程管理](#112-课程管理)
    - [1.12.1. 添加课程](#1121-添加课程)
    - [1.12.2. 查询课程](#1122-查询课程)
    - [1.12.3. 删除课程](#1123-删除课程)
  - [1.13. 成绩录入](#113-成绩录入)
    - [1.13.1. 添加成绩](#1131-添加成绩)
    - [1.13.2. 查询成绩](#1132-查询成绩)
    - [1.13.3. 修改成绩](#1133-修改成绩)

<!-- /TOC -->

## 1.1. tips

- 单用户登录
- 德育,智育,综合,班级,专业排名
- code :
  - 0 : 一切正常
  - 1 : 直接将 message 展示给用户
  - 2 : 验证用户无效,跳转至登录页

---

## 1.2. function

- 新添加课程
- 添加个人得分

---

## 1.3. 学院管理

### 1.3.1. 添加学院

- POST /xkp/academy
- payload :

```json
{
    "name": "信息"
}
```

- return:
  - data : 学院 id

```json
{
    "code": 0,
    "message": "",
    "data": 23
}
```

---

### 1.3.2. 查询学院

- GET /xkp/academy
- return :
  - id : 学院的唯一键, 序号由前端生成

```json
{
    "code": 0,
    "message": "",
    "data": [
        {
            "id": 23,
            "name": "信息"
        },
        {
            "id": 24,
            "name": "文法"
        }
    ]
}
```

---

### 1.3.3. 查询学院名称

- GET /xkp/academy/{systemId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": "信息学院"
}
```

---

### 1.3.4. 删除学院

- DELETE /xkp/academy/{systemId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.4. 管理员设置

### 1.4.1. 添加管理员

- POST /xkp/manager
- payload :

```json
{
    "username": "xxxykpzx",
    "academyId": 2,
    "specialtyId": 2,
    "classId": 2,
    "grade": "2015",
    "type": "C"
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": {
        "username": "xxxykpzx",
        "password": "qazwsxed"
    }
}
```

---

### 1.4.2. 查询管理员

- GET /xkp/manager?
  - academyId : 学院 id (必须)
  - specialtyId : 专业 id
  - classId : 班级 id
  - grade : 年级
- return :

```json
{
    "code": 0,
    "message": "",
    "data": [
        {
            "systemId": 23,
            "username": "xxxy"
        },
        {
            "systemId": 24,
            "username": "wexy"
        }
    ]
}
```

---

### 1.4.3. 重置密码

- PUT /xkp/manager/reset/{systemId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": {
        "username": "xxxykpzx",
        "password": "qazwsxed"
    }
}
```

---

### 1.4.4. 修改密码

- PUT /xkp/manager/change
- payload :

```json
{
    "systemId": 2,
    "oldPassword": "asdfg",
    "newPassword": "asdfg"
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

---

### 1.4.5. 删除管理员

- DELETE /xkp/manager/{systemId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.5. 登录设置

### 1.5.1. 登录

- POST /xkp/login
- payload :

```json
{
    "username": "2015111363",
    "password": "123456789"
}
```

- return :
  - type : A 管理员 | B 学院 | C 学生

```json
{
    "code": 0,
    "message": "",
    "data": {
        "systemId": 12,
        "token": "asdfgh",
        "type": "C",
        "grade": "2017",
        "academyId": 12,
        "specialtyId": 3,
        "classId": 13,
    }
}
```

---

### 1.5.2. 登录控制

- PUT /xkp/login
- payload :
  - academyId : 学院 id
  - grade : 年级
  - enable : true 允许登录 | false 禁止登录

```json
{
    "academyIds": [
        12,
        32
    ],
    "grades": [
        "2014",
        "2015"
    ],
    "status": true
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.6. 数据管理

### 1.6.1. 添加年级

- POST /xkp/grade
- payload :

```json
{
    "grade": "2015"
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": "2015"
}
```

---

### 1.6.2. 查询年级

- GET /xkp/grade
- return :

```json
{
    "code": 0,
    "message": "",
    "data": [
        "2015",
        "2016"
    ]
}
```

---

### 1.6.3. 删除年级

- DELETE /xkp/grade/{grade}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

### 1.6.4. 开启新学期*

- GET /xkp/data
- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.7. 大表查询*

### 1.7.1. 查看大表

- GET /xkp/benchmark?
  - academyId : 学院 id
  - specialtyId : 专业 id
  - classId : 班级 id
  - grade : 年级
- return :

```json

```

---

### 1.7.2. 下载大表

- GET /xkp/benchmark/download

---

## 1.8. 专业管理

### 1.8.1. 添加专业

- POST /xkp/specialty
- payload :

```json
{
    "academyId": 213,
    "name": "电气自动化"
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": 23
}
```

---

### 1.8.2. 查询专业

- GET /xkp/specialty/{academyId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": [
        {
            "systemId": 23,
            "name": "电气自动化"
        },
        {
            "systemId": 24,
            "name": "机械电子"
        }
    ]
}
```

---

### 1.8.3. 删除专业

- DELETE /xkp/specialty/{systemId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.9. 班级管理

### 1.9.1. 添加班级

- POST /xkp/class
- payload :

```json
{
    "specialtyId": 2345,
    "grade": "2014",
    "name": "一班"
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": 23
}
```

---

### 1.9.2. 查询班级

- GET /xkp/class?
  - specialtyId : 专业 id
  - grade : 年级
- return :

```json
{
    "code": 0,
    "message": "",
    "data": [
        {
            "systemId": 23,
            "name": "一班"
        },
        {
            "systemId": 24,
            "name": "二班"
        }
    ]
}
```

---

### 1.9.3. 删除班级

- DELETE /xkp/class/{systemId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.10. 班级成员

### 1.10.1. 添加学生

- POST /xkp/student
- paylaod :

```json
{
    "classId": 22,
    "studentNumber": 2015113633,
    "name": "zhang"
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": 123456
}
```

---

### 1.10.2. 查询学生

- GET /xkp/student/{classId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": [
        {
            "systemId": 123,
            "name": "zhang",
            "studentNumber": "2015113633"
        }
    ]
}
```

---

### 1.10.3. 删除学生

- DELETE /xkp/student/{systemId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.11. 基本加分

### 1.11.1. 查询基本加分

- GET /xkp/base-score/{classId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": [
        {
            "systemId": 231,
            "studentNumber": "2015111363",
            "name": "张三",
            "moral": 20.3,
            "activity": 23.5,
            "duty": 12.0,
            "academic": 30.0,
            "behavior": "优",
            "academicDesc": "论文一篇",
            "dutyDesc": "班长"
        }
    ]
}
```

---

### 1.11.2. 修改基本加分

- PUT /xkp/base-score
- payload :
  - moral : 德育
  - activity : 文体
  - duty : 职务
  - academic : 学术
  - behavior : 操行评等 优 | 良 | 中 | 差

```json
{
    "systemId": 231,
    "moral": 20.3,
    "activity": 23.5,
    "duty": 12.0,
    "academic": 30.0,
    "behavior": "优",
    "academicDesc": "论文一篇",
    "dutyDesc": "班长"
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.12. 课程管理

### 1.12.1. 添加课程

- POST /xkp/course
- payload :
  - credit : 学分
  - type : true 考试 | false 考察

```json
{
    "classId": 1234,
    "name": "高数",
    "credit": 4.5,
    "type": true
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": 123456
}
```

---

### 1.12.2. 查询课程

- GET /xkp/course/{classId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": [
        {
            "systemId": 12,
            "courseId": 1234,
            "name": "高数",
            "credit": 4.5,
            "type": true
        }
    ]
}
```

---

### 1.12.3. 删除课程

- DELETE /xkp/course/{courseId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

## 1.13. 成绩录入

### 1.13.1. 添加成绩

- POST /xkp/score
- payload :
  - studentId : 学生 id
  - courseId : 课程 id
  - type : true 考试 | false 考察
  - examination : 分数 (考试)
  - inspection  : 优秀 | 良好 | 中等 | 及格 | 不及格 (考察)

```json
{
    "studentId": 231,
    "marks": [
        {
            "courseId": 1234,
            "type": true,
            "examination": 70,
            "inspection": null
        }
    ]
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---

### 1.13.2. 查询成绩

- GET /xkp/score/{classId}
- return :

```json
{
    "code": 0,
    "message": "",
    "data": [
        {
            "studentId": 231,
            "studentNumber": "2015111363",
            "name": "张三",
            "marks": [
                {
                    "courseId": 1234,
                    "type": true,
                    "examination": 70,
                    "inspection": null
                }
            ]
        }
    ]
}
```

---

### 1.13.3. 修改成绩

- PUT /xkp/score
- payload :
  - studentId : 学生 id
  - courseId : 课程 id
  - type : true 考试 | false 考察

```json
{
    "studentId": 231,
    "marks": [
        {
            "courseId": 1234,
            "type": true,
            "examination": 70,
            "inspection": null
        }
    ]
}
```

- return :

```json
{
    "code": 0,
    "message": "",
    "data": true
}
```

---