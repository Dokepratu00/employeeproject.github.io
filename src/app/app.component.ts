import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from './models/employee.model';
import { EmployeeService } from './service/employee.service';
import { AbstractControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;
  title = 'employee-management-system';

  employeeForm: FormGroup;

  employees: Employee[];
  employeesToDisplay: Employee[];
  educationOptions = [
    '10th pass',
    'diploma',
    'graduate',
    'post graduate',
    'PhD',
  ];
  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.employeeForm = fb.group({});
    this.employees = [];
    this.employeesToDisplay = this.employees;
  }

  birthdayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthday = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthday.getFullYear();
  
      // Check if the age is less than 18
      if (age < 18) {
        return { ageBelow18: true };
      }
  
      return null;
    };
  }
  

  alphaOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null; // No validation error if the field is empty
      }
  
      const isValid = /^[a-zA-Z]+$/.test(value); // Check if the value contains only alphabets
  
      return isValid ? null : { alphaOnly: { value: control.value } };
    };
  }
  
  


  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstname: this.fb.control('',[Validators.required,this.alphaOnlyValidator()]),
      lastname: this.fb.control('',[Validators.required,this.alphaOnlyValidator()]),
      birthday: this.fb.control('',[this.birthdayValidator()]),
      gender: this.fb.control(''),
      education: this.fb.control('default'),
      company: this.fb.control(''),
      jobExperience: this.fb.control(''),
      salary: this.fb.control(''),
    });

    
    

    this.employeeService.getEmployees().subscribe((res) => {
      for (let emp of res) {
        this.employees.unshift(emp);
      }
      this.employeesToDisplay = this.employees;
    });
  }

  ngAfterViewInit(): void {
    //this.buttontemp.nativeElements.click();
  }

  addEmployee() {
    let employee: Employee = {
      firstname: this.FirstName.value,
      lastname: this.LastName.value,
      birthdate: this.BirthDay.value,
      gender: this.Gender.value,
      education: this.educationOptions[parseInt(this.Education.value)],
      company: this.Company.value,
      jobExperience: this.JobExperience.value,
      salary: this.Salary.value,
      profile: this.fileInput.nativeElement.files[0]?.name,
    };

    this.employeeService.postEmployee(employee).subscribe((res) => {
      this.employees.unshift(res);
      this.clearForm();
    });
  }

  removeEmployee(event: any) {
    this.employees.forEach((val, index) => {
      if (val.id === parseInt(event)) {
        this.employeeService.deleteEmployee(event).subscribe((res) => {
          this.employees.splice(index, 1);
        });
      }
    });
  }

  editEmployee(event: any) {
    this.employees.forEach((val, ind) => {
      if (val.id === event) {
       this.setForm(val); 
      }
    });
    this.removeEmployee(event);
    this.addEmployeeButton.nativeElement.click();
  }

  

  setForm(emp: Employee) {
    this.FirstName.setValue(emp.firstname);
    this.LastName.setValue(emp.lastname);
    this.BirthDay.setValue(emp.birthdate);
    this.Gender.setValue(emp.gender);

    let educationIndex = 0;
    this.educationOptions.forEach((val, index) => {
      if (val === emp.education) educationIndex = index;
    });
    this.Education.setValue(educationIndex);

    this.Company.setValue(emp.company);
    this.JobExperience.setValue(emp.jobExperience);
    this.Salary.setValue(emp.salary);
    this.fileInput.nativeElement.value = '';
  }
  searchEmployees(event: any) {
    let filteredEmployees: Employee[] = [];

    if (event === '') {
      this.employeesToDisplay = this.employees;
    } else {
      filteredEmployees = this.employees.filter((val, index) => {
        let targetKey = val.firstname.toLowerCase() + '' + val.lastname.toLowerCase();
        let searchKey = event.toLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeesToDisplay = filteredEmployees;
    }
  }

  clearForm() {
    this.FirstName.setValue('');
    this.LastName.setValue('');
    this.BirthDay.setValue('');
    this.Gender.setValue('');
    this.Education.setValue('');
    this.Company.setValue('');
    this.JobExperience.setValue('');
    this.Salary.setValue('');
    this.fileInput.nativeElement.value = '';
  }

  public get FirstName(): FormControl {
    return this.employeeForm.get('firstname') as FormControl;
  }
  public get LastName(): FormControl {
    return this.employeeForm.get('lastname') as FormControl;
  }
  public get BirthDay(): FormControl {
    return this.employeeForm.get('birthday') as FormControl;
  }
  public get Gender(): FormControl {
    return this.employeeForm.get('gender') as FormControl;
  }
  public get Education(): FormControl {
    return this.employeeForm.get('education') as FormControl;
  }
  public get Company(): FormControl {
    return this.employeeForm.get('company') as FormControl;
  }
  public get JobExperience(): FormControl {
    return this.employeeForm.get('jobExperience') as FormControl;
  }
  public get Salary(): FormControl {
    return this.employeeForm.get('salary') as FormControl;
  }
}
