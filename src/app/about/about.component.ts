import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { flyInOut,expand } from '../animations/app.animation';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class AboutComponent implements OnInit {

  Leaders : Leader[];

  constructor(private dishservice: LeaderService,
    private route: ActivatedRoute,
    private location: Location) { }

    leader: Leader[];


    ngOnInit() {
      this.dishservice.getLeaders().subscribe((leader) => (this.Leaders) = leader);
    }

    goBack(): void{
      this.location.back();
    }

}
