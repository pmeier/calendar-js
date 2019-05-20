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
import Property from "./property.js";
import { startStringWith, uc } from '../helpers/stringHelper.js';

/**
 * @class AttendeeProperty
 * @classdesc This class represents an attendee property as defined in RFC 5545 Section 3.8.4.1
 *
 * @url https://tools.ietf.org/html/rfc5545#section-3.8.4.1
 */
export default class AttendeeProperty extends Property {

	/**
	 * Returns the role of the attendee.
	 *
	 * @returns {string}
	 */
	get role() {
		const allowed = ['CHAIR', 'REQ-PARTICIPANT', 'OPT-PARTICIPANT', 'NON-PARTICIPANT']
		const defaultValue = 'REQ-PARTICIPANT'

		if (this.hasParameter('ROLE')) {
			const value = this.getParameterFirstValue('ROLE')
			if (allowed.includes(value)) {
				return value
			}
		}

		return defaultValue
	}

	/**
	 * Sets new role of the attendee
	 *
	 * @param {String} role
	 */
	set role(role) {
		this.updateParameterIfExist('ROLE', role)
	}

	/**
	 * Returns the calendar-user-type of an attendee
	 *
	 * @returns {string}
	 */
	get userType() {
		const allowed = ['INDIVIDUAL', 'GROUP', 'RESOURCE', 'ROOM', 'UNKNOWN']

		if (!this.hasParameter('CUTYPE')) {
			return 'INDIVIDUAL'
		} else {
			const value = this.getParameterFirstValue('CUTYPE')
			if (allowed.includes(value)) {
				return value
			}

			return 'UNKNOWN'
		}
	}

	/**
	 * Sets new calendar-user-type of attendee
	 *
	 * @param {String} userType
	 */
	set userType(userType) {
		this.updateParameterIfExist('CUTYPE', userType)
	}

	/**
	 * Returns the "Répondez s'il vous plaît" value for attendee
	 *
	 * @returns {boolean}
	 */
	get rsvp() {
		if (!this.hasParameter('RSVP')) {
			return false
		} else {
			const value = this.getParameterFirstValue('RSVP')
			return uc(value) === 'TRUE'
		}
	}

	/**
	 * Updates the "Répondez s'il vous plaît" value for attendee
	 *
	 * @param {boolean} rsvp
	 */
	set rsvp(rsvp) {
		this.updateParameterIfExist('RSVP', rsvp ? 'TRUE' : 'FALSE')
	}

	/**
	 * Returns the common-name of the attendee
	 *
	 * @returns {string|null}
	 */
	get commonName() {
		return this.getParameterFirstValue('CN')
	}

	/**
	 * Sets a new common-name of the attendee
	 *
	 * @param {string} commonName
	 */
	set commonName(commonName) {
		this.updateParameterIfExist('CN', commonName)
	}

	/**
	 * Returns the participation-status of the attendee
	 *
	 * @returns {string}
	 */
	get participationStatus() {
		let vobjectType
		if (this.parent) {
			vobjectType = this.parent.name
		} else {
			// let's assume we are inside an event
			// if we don't know better
			vobjectType = 'VEVENT'
		}

		const allowed = {
			'VEVENT': ['NEEDS-ACTION', 'ACCEPTED', 'DECLINED', 'TENTATIVE', 'DELEGATED'],
			'VJOURNAL': ['NEEDS-ACTION', 'ACCEPTED', 'DECLINED'],
			'VTODO': ['NEEDS-ACTION', 'ACCEPTED', 'DECLINED', 'TENTATIVE', 'DELEGATED', 'COMPLETED', 'IN-PROCESS']
		}

		if (!this.hasParameter('PARTSTAT')) {
			return 'NEEDS-ACTION'
		} else {
			const value = this.getParameterFirstValue('PARTSTAT')
			if (allowed[vobjectType].includes(value)) {
				return value
			}

			return 'NEEDS-ACTION'
		}
	}

	/**
	 * Sets a new participation-status of the attendee
	 *
	 * @param {String} participationStatus
	 */
	set participationStatus(participationStatus) {
		this.updateParameterIfExist('PARTSTAT', participationStatus)
	}

	/**
	 * Gets this attendee's language
	 *
	 * @returns {String}
	 */
	get language() {
		return this.getParameterFirstValue('LANGUAGE')
	}

	/**
	 * Sets this attendee's language
	 * This can be used to influence the language of the invitation email
	 *
	 * @param language
	 */
	set language(language) {
		this.updateParameterIfExist('LANGUAGE', language)
	}

	/**
	 * Gets the email of the attendee
	 *
	 * @returns {String}
	 */
	get email() {
		return this.value
	}

	/**
	 * Sets the email address of the attendee
	 *
	 * @param {String} email
	 */
	set email(email) {
		this.value = startStringWith(email, 'mailto:')
	}

	/**
	 * Is this attendee the organizer?
	 *
	 * @returns {boolean}
	 */
	isOrganizer() {
		return this._name === 'ORGANIZER'
	}

	/**
	 * Creates a new AttendeeProperty from name and email
	 *
	 * @param {String} name
	 * @param {String} email
	 * @param {Boolean=} isOrganizer
	 * @returns {AttendeeProperty}
	 */
	static fromNameAndEMail(name, email, isOrganizer=false) {
		const propertyName = isOrganizer
			? 'ORGANIZER'
			: 'ATTENDEE'

		email = startStringWith(email, 'mailto:')
		return new AttendeeProperty(propertyName, email, [['CN', name]])
	}

	/**
	 * Creates a new AttendeeProperty from name, email, role, userType and rsvp
	 *
	 * @param {String} name
	 * @param {String} email
	 * @param {String} role
	 * @param {String} userType
	 * @param {Boolean} rsvp
	 * @param {Boolean=} isOrganizer
	 * @returns {AttendeeProperty}
	 */
	static fromNameEMailRoleUserTypeAndRSVP(name, email, role, userType, rsvp, isOrganizer=false) {
		const propertyName = isOrganizer
			? 'ORGANIZER'
			: 'ATTENDEE'

		email = startStringWith(email, 'mailto:')
		return new AttendeeProperty(propertyName, email, [
			['CN', name],
			['ROLE', role],
			['CUTYPE', userType],
			['RSVP', rsvp ? 'TRUE' : 'FALSE']
		])
	}
}
