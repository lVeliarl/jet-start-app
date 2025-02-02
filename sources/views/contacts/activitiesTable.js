import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {activityTypes} from "../../models/activityTypes";
import {contacts} from "../../models/contacts";
import PopupView from "../popupView";

export default class ActivitiesTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "datatable",
					localId: "activities",
					css: "table_outline",
					scroll: "auto",
					select: true,
					borderless: true,
					columns: [
						{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
						{id: "TypeID", header: [{content: "richSelectFilter"}], options: activityTypes, sort: "string"},
						{id: "DueDate", header: [{content: "dateRangeFilter", inputConfig: {format: webix.i18n.longDateFormatStr}}], sort: "date", width: 150, format: webix.i18n.longDateFormatStr},
						{id: "Details", header: [{content: "textFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "editActivity", header: "", width: 50, template: "<span class='mdi mdi-file-document-edit edit_entry'></span>"},
						{id: "deleteActivity", header: "", width: 50, template: "<span class='mdi mdi-trash-can delete_entry'></span>"}
					],
					onClick: {
						delete_entry: (e, id) => {
							webix.confirm({
								title: _("Delete this entry"),
								text: _("Are you sure you want to delete this entry?"),
								ok: _("OK"),
								cancel: _("Cancel")
							}).then(() => {
								activities.remove(id);
							});
							return false;
						},
						edit_entry: (e, id) => {
							this.window.showWindow("Edit", id);
							return false;
						}
					},
					on: {
						onAfterFilter: () => {
							let id = this.getParam("id");
							this.$$("activities").filter(obj => obj.ContactID.toString() === id.toString(), "", true);
						}
					}
				},
				{
					padding: 5,
					cols: [
						{gravity: 3},
						{
							view: "button",
							type: "icon",
							icon: "mdi mdi-plus-box",
							label: _("Add activity"),
							css: "webix_primary",
							click: () => {
								let id = this.getParam("id");
								this.window.showWindow("Add", id, true);
							}
						}
					]
				}
			]
		};
	}

	init() {
		let activitiesTable = this.$$("activities");

		activities.waitData.then(() => {
			activitiesTable.sync(activities, () => {
				this.$$("activities").filterByAll();
			});
		});

		this.window = this.ui(PopupView);
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData
		]).then(() => {
			this.$$("activities").filterByAll();
		});
	}
}
