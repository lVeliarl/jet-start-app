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
				ContactID: webix.rules.isNotEmpty
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
					label: "Contact",
					name: "ContactID",
					options: contacts,
					invalidMessage: "Please select an option"

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
						id: "saveChanges",
						css: "webix_primary",
						click: () => {
							if (this.$$("popup_form").validate()) {
								let formValues = this.$$("popup_form").getValues();
								let id = formValues.id;
								if (activities.exists(id)) {
									activities.updateItem(id, formValues);
								}
								else { activities.add(formValues); }
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

	showWindow(item, mode) {
		this.getRoot().show();

		if (item && mode === "Edit") {
			this.$$("popup_form").setValues(item);
			this.$$("saveChanges").setValue("Save");
			this.$$("windowHeader").setHTML(`${mode} activity`);
		}

		if (mode === "Add") {
			this.$$("popup_form").setValues({DueDate: new Date(), Time: new Date()});
			this.$$("saveChanges").setValue("Add");
			this.$$("windowHeader").setHTML(`${mode} activity`);
		}
	}

	closeWindow() {
		this.getRoot().close();
	}
}

