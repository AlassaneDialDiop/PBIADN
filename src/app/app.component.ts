import { Component, OnInit, Type } from '@angular/core';

import * as pbiClient from 'powerbi-client';
import { TypeElement } from './type-element';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'Power BI Embedded POC';
  clientId = "5e13f7af-483d-4a01-af57-f2784b951e61";
  clientSecret = "";
  clientSecretEncoded = "";
  resource = "https://analysis.windows.net/powerbi/api";
  resourceEncoded="https%3A%2F%2Fanalysis.windows.net%2Fpowerbi%2Fapi";
  grantType = "password";
  
  //username= "alassane.diop@adncorp.com";
  username= "youssef.hassani@adncorp.com";
  // appUsername = "VanArsdel";
   //role = "Manufacturer";
   //appUsername = "EffectiveIdentity";
   
  appUsername = "youssef";
  // appUsername = "alassane";
   role = "compte1";
  // usernameEncoded= "alassane.diop%40adncorp.com";
   usernameEncoded= "youssef.hassani%40adncorp.com";
   //password = "AdnADD2018";
             password= "Hore60022?"

  scope = "openid";
  type = "report";
  typeId = "";
  //groupId = "e1c398ae-3081-4275-8051-4c395dab6a8e";
      groupId = "e58aadf8-2581-40e1-9b6f-ae2f78bdfa4c";
 // datasetId= "9797b27c-8604-4b0d-954d-01507b06b292";
 datasetId = "9f36ba40-0503-40a0-a7a9-997aa6a2edfb"; 
  mode= "view";
  modeValue: pbiClient.models.ViewMode = pbiClient.models.ViewMode.View;
  shown = "-";
  typeElementLists = {
    reports: [{id:"aaa", name:"bbb"}],
    dashboards: [{id:"ddd", name:"eee"}],
    datasets: [{id:"rrr", name:"ooo"}]
  };

  allTypes = [
    {
    name: "report",
    img: "../assets/icons/reportIcon.png"
    },
    {
      name: "dashboard",
      img: "../assets/icons/dashboardIcon.png"
      },
      {
        name: "dataset",
        img: "../assets/icons/datasetIcon.png"
        }
      ];
    pages =[];
    pageActive = 0;

    constructor( private httpClient: HttpClient){}
  ngOnInit() {

    this.getList();
  }

  mod(){ 
    console.log(this.mode);
    if(this.mode == "edit") {
      console.log("to view");
      this.mode = "view";
      this.modeValue = pbiClient.models.ViewMode.View;
    }
    else if(this.mode == "view") {
      console.log("to edit");
      this.mode = "edit"; 
      this.modeValue = pbiClient.models.ViewMode.Edit;
    }
  }

  print(){
    console.log(this.clientId);
    console.log(this.type);
    console.log(this.typeId);
    console.log(this.groupId);
    let embedUrl = "https://app.powerbi.com/reportEmbed?"+this.type+"Id="+this.typeId+"&groupId="+this.groupId+"";
    console.log(embedUrl);
  }
  
  hasType(type: string): boolean {
    if(this.type == type){
      return true;
    }
    return false;
  }
  
  hasTypeElement(typeElement: TypeElement): boolean {
    if(this.typeId == typeElement.id){
      return true;
    }
    return false;
  }

  selectTypePerso($event: any, type: string): void {
    let checked = $event.target.checked;
    console.log(checked);
    if ( checked ) {
      this.type = type;
    }
    console.log(this.type);
  }
  
  selectTypeElement(typeElement: TypeElement): void {
      this.typeId = typeElement.id;
      this.type = typeElement.type;
    console.log(this.typeId);
  }


  getList(){
    console.log('Listed');
    this.getFirstToken().then(
      (res:string) => {
                          let firstToken = this.getValueFromJson(res, 'access_token', 'refresh_token')[0];
                          
                          this.allTypes.forEach( (typeSelected) => {

                            console.log(typeSelected.name.toUpperCase());
                            
                          this.getUrls(firstToken, typeSelected.name).then((liste:string) => {
                            var j = 0;
                            var tableau = this.getValueFromJson(liste, 'id','name');

                            if(typeSelected.name === 'report'){
                              this.typeElementLists.reports = [];
                            }
                            if(typeSelected.name === 'dashboard'){
                              this.typeElementLists.dashboards = [];
                            }
                            if(typeSelected.name === 'dataset'){
                              this.typeElementLists.datasets = [];
                            }
                            for(j=0; j<tableau.length; j++){
                              let idArray = this.getValueFromJson(liste, 'id','name')[j];
                              let nameArray = '';
                              if(typeSelected.name == 'report'){
                                nameArray = this.getValueFromJson(liste, 'name','webUrl')[j];
                              }
                              else if(typeSelected.name == 'dashboard'){
                                nameArray = "";
                              }
                              else if(typeSelected.name == 'dataset'){
                          //      nameArray = this.getValueFromJson(liste, 'name','webUrl')[j];
                                nameArray = this.getValueFromJson(liste, 'name','addRowsAPIEnabled')[j];
                              }
                              
                                
                              var report = {
                                type: typeSelected.name,
                                id: idArray,
                                name: nameArray
                              };
                              
                            if(typeSelected.name === 'report'){
                              this.typeElementLists.reports.push(report);
                              console.log(this.typeElementLists.reports);
                            }
                            else if(typeSelected.name === 'dashboard'){
                              this.typeElementLists.dashboards.push(report);
                              console.log(this.typeElementLists.dashboards);
                            }
                            else if(typeSelected.name === 'dataset'){
                              this.typeElementLists.datasets.push(report);
                              console.log(this.typeElementLists.datasets);
                            }
                            }
                          });
                            
                          });
    });
  }

  updatePage(){
    console.log('UPDATED');
    this.getFirstToken().then(
      (res:string) => {
                          let firstToken = this.getValueFromJson(res, 'access_token', 'refresh_token')[0];
                          
                          this.getSecondToken(firstToken).then((rest: string) => { 
                            console.log(JSON.parse(rest));
                            console.log(this.getValueFromJson(rest,"token","tokenId"));
                            
                            let finalAccessToken = this.getValueFromJson(rest,"token","tokenId")[0];
                            this.getReports(finalAccessToken);
                                                                      }
                                                  )
/*
                          this.getUrls(this.firstToken).then((rest: string) => { 
                            console.log(rest);
                            console.log(this.getValueFromJson(rest, 'embedUrl', 'isOwnedByMe'));
                                                                                this.getReportsInFrame(this.getValueFromJson(rest, 'embedUrl', 'isOwnedByMe'));
                                                                      }
                                                  )
                                                  */
                      }
      );
  }

  getReports(finalAccessToken: string) {
    
    // Get models. models contains enums that can be used.
    
    // We give All permissions to demonstrate switching between View and Edit mode and saving report.
    let permissions = pbiClient.models.Permissions.All;
    

    let embedUrlHere = "https://app.powerbi.com/reportEmbed?"+this.type+"Id="+this.typeId+"&groupId="+this.groupId+"";

        const config = {

            type: this.type,
            tokenType: pbiClient.models.TokenType.Embed,
            accessToken: finalAccessToken,
            embedUrl: embedUrlHere,
            groupId: this.groupId,
            id: this.typeId,
            
            pageView: pbiClient.models.PageSizeType.Widescreen,
            permissions: permissions,     
            viewMode: this.modeValue
            /*,
            settings: {
              filterPaneEnabled: false,
              navContentPaneEnabled: false
            }*/
        };
        console.log(config.type);
        console.log(config.accessToken);
        console.log(config.id);
        console.log(config.embedUrl);
              
      let reportsContainer = <HTMLElement>document.getElementById("reportsContainer");
      let displayContainer = <HTMLElement>document.getElementById("displayContainer");
      let loadingContainer = <HTMLElement>document.getElementById("loadingContainer");

      displayContainer.classList.add("invisible");
      loadingContainer.classList.remove("invisible");
        // Embed the report and display it within the div container.
      let powerbi = new pbiClient.service.Service(
          pbiClient.factories.hpmFactory,
          pbiClient.factories.wpmpFactory,
          pbiClient.factories.routerFactory
        );
      powerbi.reset(reportsContainer);
      console.log("GOOD")


      let report = <pbiClient.Report>powerbi.embed(reportsContainer, config);
        // Report.off removes a given event handler if it exists.
        report.off('loaded');
        console.log("Logging");
        // Report.on will add an event handler which prints to Log window.
        
        this.pages = [];
        var original = this;

        report.on('loaded', function() {
          
          console.log("L");
          console.log('Loaded');
                  
            report.getPages().then((pagesFound) => {
              pagesFound.forEach(element => {
                console.log(element.displayName);
                original.shown = element.displayName;
                let shownText = <HTMLElement>document.getElementById("name");
                shownText.classList.remove("shownInvisible");
                original.pages.push(element.displayName);
              });
              pagesFound[0].setActive();
              this.pageActive = 0;
            });
          loadingContainer.classList.add("invisible");
          displayContainer.classList.remove("invisible");
          console.log("Weird")
        });

        
        report.off('pageChanged');
        report.on('pageChanged', e => {
          loadingContainer.classList.add("invisible");
          displayContainer.classList.remove("invisible");
          console.log("Weird")
          console.log(e);
        });
        report.on('error', function(event) {
          console.log(event.detail);
          report.off('error');
    });
    
  }

  getIndicesOf(searchStr: string, str: string, caseSensitive: boolean = true) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    console.log('---');
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}
  getValueFromJson(source:Object, motCle:string, limite:string){

    console.log('Source:', source.toString());
    console.log('Mot Cle:', motCle);
    console.log('Limite:', limite);

    const store = source.toString();
    const length = motCle.length;
    const debut = this.getIndicesOf(motCle, store);
    const fin = this.getIndicesOf(limite, store);
    var i = 0;
    var tab = [];
    for(i=0; i<debut.length; i++){
      tab.push(store.substring(debut[i]+length+3, fin[i]-3));
    }
    return tab;
  }
  
  getFirstToken(){

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
          'cache-control': 'no-cache',
          'Access-Control-Expose-Headers': 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization,cache-control',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization,cache-control',
           'Access-Control-Allow-Credentials': "true"
        })};
      
      const formData = new FormData();
      formData.append('client_id', this.clientId);
      formData.append('client_secret',this.clientSecretEncoded);
      formData.append('resource',this.resourceEncoded);
      formData.append('grant_type',this.grantType);
      formData.append('username', this.usernameEncoded);
      formData.append('password',this.password);
      formData.append('scope',this.scope);

      const formDataa =  "client_id="+this.clientId+"&client_secret="+this.clientSecretEncoded
      +"&resource="+this.resourceEncoded+"&grant_type="+this.grantType+"&username="+this.usernameEncoded
      +"&password="+this.password+"&scope="+this.scope;
      
      this.httpClient.post( "https://login.microsoftonline.com/8c645637-2ab2-41e5-b76a-68592e20eebb/oauth2/token",formDataa,httpOptions)
                          .subscribe(
                              (res) => {
                                  
                                  console.log(res);
                                  resolve(res);
                              },
                              err => console.log(err)
                          );
                            });
    }
    
  getUrls(firstAccessToken: string, typeSelected:string){
        return new Promise((resolve, reject) => {
          var urlGet = "https://api.powerbi.com/v1.0/myorg/groups/"+this.groupId+"/"+typeSelected+"s";
          var authorization = "Bearer "+firstAccessToken;
          console.log(authorization);

          
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
          'Authorization': authorization,
          'Access-Control-Expose-Headers': 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization,cache-control',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization,cache-control',
           'Access-Control-Allow-Credentials': "true"
        })};
      
      this.httpClient.get( urlGet,httpOptions)
                          .subscribe(
                              (res) => {
                                  
                                  console.log(res);
                                  resolve(res);
                              },
                              err => console.log(err)
                          );

        });
    }
  
  getSecondToken(firstAccessToken:string){
      
    return new Promise((resolve, reject) => {

        var dataText:string = '{'+'\n'
          +'\"data\":'+'\n'
          +'{'+'\n'
                      +'\"accessLevel\": \"View\",'+'\n'
                      +'\"allowSaveAs\": \"true\",'+'\n'
              //        +'\"datasetId\": \"'+this.datasetId+'\",'+'\n'
                      +'\"identities\":['+'\n'
                        +'{'+'\n'
                          +'\"username\": \"'+this.appUsername+'\",'+'\n'
                          +'\"roles\": [\"'+this.role+'\"],'+'\n'
                          +'\"datasets\": [\"'+this.datasetId+'\"]'+'\n'
                        //  +'\"customData: "MyCustomData"'
                          +'}'+'\n'
                          +']'+'\n'
                    +'}'+'\n'
                  +'}';
        
        console.log(dataText);
        var data = JSON.parse(dataText);
        console.log(data);

        
        var authorization = "Bearer "+firstAccessToken;

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': authorization,
            'Access-Control-Expose-Headers': 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization,cache-control',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization,cache-control',
             'Access-Control-Allow-Credentials': "true"
          })};

          var urlPost = 'https://api.powerbi.com/v1.0/myorg/groups/'+this.groupId+'/'+this.type+'s/'+this.typeId+'/GenerateToken';
        
        
        this.httpClient.post( urlPost,data,httpOptions)
                            .subscribe(
                                (res) => {
                                    
                                    console.log(res);
                                    resolve(res);
                                },
                                err => console.log(err)
                            );
      });
      }

  changePage(index: number){
    let reportsContainer = <HTMLElement>document.getElementById("reportsContainer");
 
        // Embed the report and display it within the div container.
        let powerbi = new pbiClient.service.Service(
          pbiClient.factories.hpmFactory,
          pbiClient.factories.wpmpFactory,
          pbiClient.factories.routerFactory
        );
    // Get a reference to the embedded report.
    let report = <pbiClient.Report>powerbi.get(reportsContainer);
    report.getPages().then((pages) => {
          pages[index].setActive();
          this.pageActive = index;
    });
}

rge(){
  console.log(this.pages);
}
run( tab: string[]) {
  this.pages = tab;
}
}

