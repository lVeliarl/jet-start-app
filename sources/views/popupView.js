import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";

export default class PopupView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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
					label: _("Details"),
					height: 100,
					name: "Details",
					resize: true
				},
				{
					view: "richselect",
					label: _("Type"),
					name: "TypeID",
					options: activityTypes,
					invalidMessage: _("Please select an option")
				},
				{
					view: "richselect",
					localId: "contact",
					label: _("Contact"),
					name: "ContactID",
					options: contacts,
					invalidMessage: _("Please select an option")

				},
				{
					cols: [
						{view: "datepicker", label: _("Date"), name: "DueDate"},
						{view: "datepicker", type: "time", label: _("Time"), name: "DueTime"}
					]
				},
				{view: "checkbox", name: "State", labelRight: _("Completed"), labelWidth: 0, checkValue: "Close", uncheckValue: "Open"},
				{
					cols: [
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
									webix.message(_("Entry successfully saved"));
									this.closeWindow();
								}
							}
						},
						{
							view: "button",
							value: _("Cancel"),
							click: () => {
								this.closeWindow();
							}
						}
					]
				}
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

	showWindow(mode, id, disabled) {
		let item = activities.getItem(id);
		let form = this.$$("popup_form");
		let editButton = this.$$("saveChanges");
		let windowHeader = this.$$("windowHeader");
		const _ = this.app.getService("locale")._;

		if (disabled) {
			this.$$("contact").disable();
			form.setValues({ContactID: id, DueDate: new Date(), DueTime: new Date()});
		}
		else {
			form.setValues(item || {DueDate: new Date(), DueTime: new Date()});
		}
		editButton.setValue(_(`${mode}`));
		windowHeader.setHTML(_(`${mode} activity`));

		this.getRoot().show();
	}

	closeWindow() {
		let form = this.$$("popup_form");
		form.clear();
		form.clearValidation();
		this.getRoot().hide();
	}
}

