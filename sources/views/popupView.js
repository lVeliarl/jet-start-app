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
					{view: "datepicker", label: "Date", name: "DueDate"},
					{view: "datepicker", type: "time", label: "Time", name: "Time"}
				]},
				{view: "checkbox", labelRight: "Selected", labelWidth: 0, name: "State"},
				{cols: [
					{gravity: 4},
					{
						view: "button",
						value: "Add/save",
						css: "webix_primary",
						click: (id) => {
							console.log(this.$$("popup_form"));
							activities.add(this.$$("popup_form").getValues());
						}
					},
					{
						view: "button",
						value: "Cancel",
						click: () => {
							this.ui(PopupView).closeWindow();
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

	showWindow(item, mode) {
		this.getRoot().show();
		console.log(this.getRoot().config.head.cols[0]);
		if (item && mode === "edit") {
			this.$$("popup_form").setValues(item);
		}

		if (mode === "add") {
			this.$$("popup_form").setValues({DueDate: new Date(), Time: new Date()});
		}
	}

	closeWindow() {
		this.getRoot().close();
	}
}

