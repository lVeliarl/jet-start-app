import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";

export default class PopupView extends JetView {
	config() {
		const popupForm = {
			view: "form",
			localId: "popup_form",
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty,
				Details: webix.rules.isNotEmpty
			},
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
					options: activityTypes,
					invalidMessage: "Please select an option"
				},
				{
					view: "richselect",
					localId: "contact",
					label: "Contact",
					name: "ContactID",
					options: contacts,
					invalidMessage: "Please select an option"

				},
				{cols: [
					{view: "datepicker", label: "Date", name: "convertedDate"},
					{view: "datepicker", type: "time", label: "Time", name: "convertedTime"}
				]},
				{view: "checkbox", name: "State", labelRight: "Selected", labelWidth: 0, checkValue: "Close", uncheckValue: "Open"},
				{cols: [
					{gravity: 4},
					{
						view: "button",
						value: "Add/save",
						localId: "saveChanges",
						css: "webix_primary",
						click: () => {
							if (this.$$("popup_form").validate()) {
								let formValues = this.$$("popup_form").getValues();
								let id = formValues.id;
								if (activities.exists(id)) {
									activities.updateItem(id, formValues);
								}
								else { activities.add(formValues); }
								webix.message("Entry successfully saved");
								this.closeWindow();
							}
						}
					},
					{
						view: "button",
						value: "Cancel",
						click: () => {
							this.closeWindow();
						}
					}
				]}
			]
		};

		return {
			view: "window",
			localId: "popup",
			move: true,
			head: {
				template: "Edit/add", localId: "windowHeader"
			},
			width: 600,
			height: 500,
			position: "center",
			modal: true,
			body: popupForm
		};
	}

	showWindow(item, mode, id, disabled) {
		let form = this.$$("popup_form");
		let editButton = this.$$("saveChanges");
		let windowHeader = this.$$("windowHeader");

		if (disabled) {
			this.$$("contact").disable();
		}

		form.setValues(item || {ContactID: id, convertedDate: new Date(), convertedTime: new Date()});
		editButton.setValue(`${mode}`);
		windowHeader.setHTML(`${mode} activity`);

		this.getRoot().show();
	}

	closeWindow() {
		let form = this.$$("popup_form");
		form.clear();
		form.clearValidation();
		this.getRoot().hide();
	}
}

