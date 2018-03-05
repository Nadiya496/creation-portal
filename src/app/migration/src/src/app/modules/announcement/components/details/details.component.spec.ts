import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as testData from './details.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { AnnouncementService } from '@sunbird/core';
import { SharedModule, ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba' }])
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
        SuiModule, SharedModule],
      providers: [HttpClientModule, AnnouncementService,
        ResourceService, ToasterService, ConfigService, HttpClient,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get announcement by id api and get success response', inject([AnnouncementService, ActivatedRoute,
    ResourceService, ToasterService, HttpClient],
    (announcementService, activatedRoute, resourceService, toasterService, http) => {
      spyOn(announcementService, 'getAnnouncementById').and.callFake(() => Observable.of(testData.mockRes.getAnnByIdSuccess));
      const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba' } } };
      spyOn(resourceService, 'getResource').and.callThrough();
      spyOn(toasterService, 'success').and.callThrough();
      spyOn(http, 'get').and.callFake(() => Observable.of(testData.mockRes.resourceBundle));
      http.get().subscribe(
        data => {
          resourceService.messages = data.messages;
        }
      );
      // spyOn(component, 'getDetails').and.callThrough();
      component.getDetails('fa355310-0b09-11e8-93d1-2970a259a0ba');
      announcementService.getAnnouncementById(params).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
      fixture.detectChanges();
    }));
});

