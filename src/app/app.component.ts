import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
​
​
export class Customerdetails {
  constructor(
  
   public name: string,
   public mobileNo: string,
   public email: string,   
  ){}
}
​
export class customerModel {
​
  Name: string;
  mobileNo: string;
  Email: string;
}

const header = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJhdmVlbiBDaGFrcmF2YXJ0aHkiLCJpZCI6MSwiZW1haWwiOiJwcmF2ZWVuLmNoYWtyYXZhcnRoeUByZWFkeWFzc2lzdC5pbiIsIm1vYmlsZU5vIjoiOTc4OTQ0NzYyOCIsIlJvbGVOYW1lIjoiQWRtaW4iLCJ2ZW5kb3JJZCI6MSwiaWF0IjoxNTk4ODUyNDYwLCJleHAiOjE2MDE0NDQ0NjB9.jOrmeFnBMaYve49vXwJCd-KjVkiMny9tB4Gh-A2Yw3w'
}

const request = {                                                                                                                                                                                 
  headers: new HttpHeaders(header), 
};
​
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  customerForm: any;
  title(title: any) {
    throw new Error("Method not implemented.");
  }
  
  data = [];
  displayedColumns: string[] = ['id', 'name', 'mobileNo', 'email', 'isActive','actions'];
  dataSource = new MatTableDataSource<Customerdetails>(this.data);
  activeindex=-1;
  user;
  @ViewChild(MatSort ,{static:true}) sort: MatSort;
  @ViewChild(MatPaginator ,{static:true}) paginator: MatPaginator;
    searchKey:string
​
constructor(private http:HttpClient) {}
isCreated:boolean=false;
isExist:boolean=false;
customerModel = new Customerdetails('', '', '');
editMode: boolean=false;
​
ngOnInit(): void {
  this.customerForm='submit'
  this.get()
  this.dataSource.sort= this.sort;
  this.dataSource.paginator=this.paginator;
  this.delete
}
  
onSubmit(a):void{  ​
  if(this.customerForm=='submit')
  {
      this.http.post('http://localhost:3000/api/customers',a,request)
      .subscribe((result)=>{
      console.log("result", result);
      this.get()
      this.isCreated =true;
      this.isExist = false;
      }, 
      error =>{
      this.isCreated=false;
      if(error.status==409)
      this.isCreated =false;
      this.isExist=true;
      })
​
    }
    else {
      this.update()
    }
      }
​
​
   CloseAlert(){
      this.isExist=false;
      }
   closesubmit(){
         this.isCreated=false;  
       }
​
get()
   {
     return this.http.get<any>('http://localhost:3000/api/customers',request)
    .subscribe((res:any[])=>{
      console.log(res)
      this.dataSource.data=res
     
    })
   }
   
   
   delete(id:number,isActive:boolean){
    if(isActive){
   this.http.patch('http://localhost:3000/api/customers/' +id , {
     "isActive": false,    
   },request)
   .subscribe((da)=>{
     this.get();
   })
  }
   else{
     this.http.patch('http://localhost:3000/api/customers/'+id , {
     "isActive": true,    
   },request)
   .subscribe((da)=>{
     this.get();
   })
  }
} 
  update()
  {
    console.log(this.activeindex);
    return this.http.patch<any>('http://localhost:3000/customers/'+this.activeindex,{
      id:this.activeindex,
      name: this.customerModel.name,
      mobileNo: this.customerModel.mobileNo,
      email: this.customerModel.email,
      
    },request)
    .subscribe((res: any[])=>{
      this.data=res
      this.editMode=false;
      this.get();
    })
  }
  edit(obj,isActive:boolean) {
    if(isActive)
    {
    this.editMode=true;
    console.log(obj);
    this.customerForm='Update';
    this.customerModel.name=obj.name,
    this.customerModel.mobileNo=obj.mobileNo,
    this.customerModel.email=obj.email,
    this.activeindex=obj.id;
  }}
​
   onSearchClear(){
    this.searchKey="";
    this.applyFilter()
  }
  applyFilter(){
    this.dataSource.filter=this.searchKey.trim().toLowerCase();  }
}