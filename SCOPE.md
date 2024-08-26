Roles
1. Admin
2. Institute Owner a.k.a Owner
3. Teacher

Admin
- Owner CRUD
- Teacher CRUD
- Can assign owners to institute
- Analytics
- see the list of institutes and there license validation etc
- ⁠see and manage their usage

Owner
- Teacher CRUD
- Classes CRUD
- Subject CRUD
- Can assign teachers to class
- Can add subjects to class
- Can assign teacher to subjects
- Track exams and progress
- Analytics

Teacher
- Add syllabus for subjects
- Generate Exam papers
- Exams will have a deadline scheduled by owner

Auth
- Create User will be done by Admin(No sign up)
  - Users Details
    - Email
    - Password
    - Name
    - Institute Name
    - Role
    - Permission
- Login using email and password
