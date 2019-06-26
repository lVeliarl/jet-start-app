import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";

export default class PopupView extends JetView {
	config() {
		const popupForm = {
			view: "form",
			localId: "popup_form",
			elements: [
				{
					view: "text",
					label: "Details",
					height: 100,
					name: "Details",
					resize: true
				},
				{
					view: "richselect",
					label: "Type",
					name: "TypeID",
					options: activityTypes
				},
				{
					view: "richselect",
					label: "Contact",
					name: "ContactID",
					options: contacts
				},
				{cols: [
					{view: "datepicker", label: "Date", name: "DueDate", value: new Date()},
					{view: "datepicker", type: "time", label: "Time", name: "Time", value: new Date()}
				]},
				{view: "checkbox", labelRight: "Selected", labelWidth: 0, name: "State"},
				{cols: [
					{gravity: 4},
					{
						view: "button",
						value: "Add/delete",
						css: "webix_primary",
						click: () => {
							activities.add(this.$$("popup_form").getValues());
						}
					},
					{
						view: "button",
						value: "Cancel",
						click: () => {
							// this.ui(PopupView).close();
						}
					}
				]}
			]
		};

		return {
			view: "window",
			localid: "popup",
			move: true,
			head: "Edit/Add activity",
			width: 600,
			height: 400,
			position: "center",
			close: true,
			modal: true,
			body: popupForm
		};
	}

	init() {
		this.on(this.app, "onAfterSelect", (data) => {
			if (data) {
				console.log(data);
			}
		});
	}

	showWindow() {
		this.getRoot().show();
	}
}

