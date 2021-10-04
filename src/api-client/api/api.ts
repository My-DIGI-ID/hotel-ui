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

export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './checkInCredentials.service';
import { CheckInCredentialsService } from './checkInCredentials.service';
export * from './feedback.service';
import { FeedbackService } from './feedback.service';
export * from './hotelIntegrationController.service';
import { HotelIntegrationControllerService } from './hotelIntegrationController.service';
export * from './hotels.service';
import { HotelsService } from './hotels.service';
export * from './proofRequests.service';
import { ProofRequestsService } from './proofRequests.service';
export * from './users.service';
import { UsersService } from './users.service';
export * from './webhooksForACAPY.service';
import { WebhooksForACAPYService } from './webhooksForACAPY.service';
export const APIS = [AuthenticationService, CheckInCredentialsService, FeedbackService, HotelIntegrationControllerService, HotelsService, ProofRequestsService, UsersService, WebhooksForACAPYService];
