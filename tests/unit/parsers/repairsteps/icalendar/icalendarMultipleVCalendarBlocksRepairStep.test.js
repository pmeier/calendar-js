/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <georg-nextcloud@ehrke.email>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import ICalendarMultipleVCalendarBlocksRepairStep
	from '../../../../../src/parsers/repairsteps/icalendar/icalendarMultipleVCalendarBlocksRepairStep.js';
import AbstractRepairStep from '../../../../../src/parsers/repairsteps/abstractRepairStep.js';

it('The repair step should inherit from AbstractRepairStep', () => {
	expect((new ICalendarMultipleVCalendarBlocksRepairStep() instanceof AbstractRepairStep)).toEqual(true)
})

it('The repair step should have a priority', () => {
	expect(ICalendarMultipleVCalendarBlocksRepairStep.priority()).toEqual(0)
})

it('The repair step should repair broken calendar data', () => {
	const repairStep = new ICalendarMultipleVCalendarBlocksRepairStep()
	const brokenICS = getAsset('multiple-vcalendar-blocks')
	const fixedICS = getAsset('multiple-vcalendar-blocks-sanitized')

	expect(repairStep.repair(brokenICS)).toEqual(fixedICS)
})

it('The repair step should not change valid calendar data', () => {
	const repairStep = new ICalendarMultipleVCalendarBlocksRepairStep()
	const ics = getAsset('simple-date-time-europe-berlin-dtstart-dtend')

	expect(repairStep.repair(ics)).toEqual(ics)
})
