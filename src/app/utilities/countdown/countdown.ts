/*
 * Copyright 2021 Bundesrepublik Deutschland
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Countdown {
  private timeDifference!: number;
  private secondsToEndOfCount!: number;
  private minutesToEndOfCount!: number;
  private hoursToEndOfCount!: number;
  public timeToEndOfCount: string = `${this.hoursToEndOfCount} h, ${this.minutesToEndOfCount} min, ${this.secondsToEndOfCount} sec`;

  private getTimeDifference(countdownEndDate: Date): void {
    this.timeDifference = countdownEndDate.getTime() - new Date().getTime();
    this.allocateTimeUnits();
  }

  private allocateTimeUnits(): void {
    this.secondsToEndOfCount = Math.floor((this.timeDifference) / (1000) % 60);
    this.minutesToEndOfCount = Math.floor((this.timeDifference) / (1000 * 60) % 60);
    this.hoursToEndOfCount = Math.floor((this.timeDifference) / (1000 * 60 * 60) % 24);
    this.timeToEndOfCount = `${this.hoursToEndOfCount} h, ${this.minutesToEndOfCount} min, ${this.secondsToEndOfCount} sec`;
  }

  public startCountdown(countdownEndDate: Date): void {
    const interval = setInterval(() => {
      this.getTimeDifference(countdownEndDate);
      if (this.timeDifference < 0) {
        clearInterval(interval);
      }
    });
  }
}
