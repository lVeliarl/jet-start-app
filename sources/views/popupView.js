import {JetView} from "webix-jet";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";

export default class PopupView extends JetView {
	config() {
		const popupForm = {
			view: "form",
			id: "popup_form",
			elements: [
				{
					view: "text",
					label: "Details",
					height: 100,
					resize: true
				},
				{
					view: "richselect",
					label: "Type",
					options: activityTypes
				},
				{
					view: "richselect",
					label: "Contact",
					options: contacts
				},
				{cols: [
					{view: "datepicker", label: "Date", value: new Date()},
					{view: "datepicker", type: "time", label: "Time", value: new Date()}
				]},
				{view: "checkbox", labelRight: "Selected", labelWidth: 0},
				{cols: [
					{gravity: 4},
					{view: "button", value: "Add/delete", css: "webix_primary"},
					{
						view: "button",
						value: "Cancel",
						click: () => {
							console.log(this);
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

	showWindow() {
		this.getRoot().show();
	}
}

