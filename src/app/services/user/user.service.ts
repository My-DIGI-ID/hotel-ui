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
import {UserCreationDTO, UserDTO, UsersService} from '../../../api-client';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public constructor (private readonly usersAPI: UsersService) {
  }

  public async getAllUsers(): Promise<UserDTO[]> {
    return await this.usersAPI.getAllUsers().toPromise();
  }

  public async getUser(id: string): Promise<UserDTO> {
    return await this.usersAPI.getUser(id).toPromise();
  }

  public async editUser(user: UserDTO): Promise<UserDTO> {
    return await this.usersAPI.updateUser(user).toPromise();
  }

  public async deleteUser(userId: string): Promise<any> {
    return await this.usersAPI.deleteUser(userId).toPromise();
  }

  public async createUser(userDetails: UserCreationDTO): Promise<UserDTO> {
    return await this.usersAPI.createUser(userDetails).toPromise();
  }
}
