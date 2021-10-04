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
import {ReplaySubject, Subject} from 'rxjs';
import {CurrentDesk} from 'src/app/utilities/current-desk/current-desk';
import {DeskDTO, HotelDTO, HotelsService} from '../../../api-client';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly hotel$: ReplaySubject<HotelDTO> = new ReplaySubject<HotelDTO>(1);
  private readonly selectedDesk$: ReplaySubject<DeskDTO> = new ReplaySubject<DeskDTO>(1);

  public constructor(private readonly hotelAPI: HotelsService,
                     private readonly currentDesk: CurrentDesk) {
    this.setSelectedDesk();
  }

  public async createHotel(hotel: HotelDTO): Promise<HotelDTO> {
    return await this.hotelAPI.createHotel(hotel).toPromise();
  }

  public async refreshHotel(): Promise<void> {
    const hotel = await this.hotelAPI.getMyHotel().toPromise();
    this.hotel$.next(hotel);
  }

  public getHotel(): Subject<HotelDTO> {
    return this.hotel$;
  }

  public getSelectedDesk(): Subject<DeskDTO> {
    return this.selectedDesk$;
  }

  public selectDesk(desk: DeskDTO): void {
    this.currentDesk.setInLocalStorage(desk);
    this.selectedDesk$.next(desk);
  }

  public clearHotel(): void {
    // tslint:disable-next-line: no-undefined-argument
    this.hotel$.next(undefined);
  }

  public async getHotelById(id: string): Promise<HotelDTO> {
    return await this.hotelAPI.getHotel(id).toPromise();
  }

  public async getAllHotels(): Promise<HotelDTO[]> {
    return this.hotelAPI.getAllHotels().toPromise();
  }

  public async deleteHotel(hotelId: string): Promise<void> {
    return await this.hotelAPI.deleteHotel(hotelId).toPromise();
  }

  public async updateHotel(hotel: HotelDTO): Promise<HotelDTO> {
    return await this.hotelAPI.updateHotel(hotel).toPromise();
  }

  private hotelIncludesDesk(hotel: HotelDTO, desk: DeskDTO): boolean {
    return hotel.desks.filter((hotelDesk: DeskDTO) => hotelDesk.id === desk.id).length > 0;
  }

  private setSelectedDesk(): void {
    this.hotel$.subscribe((hotel) => {
      if (hotel && hotel.desks.length > 0) {
        if (this.currentDesk.isSetInLocalStorage() &&
            this.hotelIncludesDesk(hotel, this.currentDesk.getFromLocalStorage()!)) {
          this.selectedDesk$.next(this.currentDesk.getFromLocalStorage()!);
        } else {
          this.selectedDesk$.next(hotel.desks[0]);
        }
      } else {
        // tslint:disable-next-line: no-undefined-argument
        this.selectedDesk$.next(undefined);
      }
    });
  }
}
