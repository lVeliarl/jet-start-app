import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {activityTypes} from "../../models/activityTypes";
import {contacts} from "../../models/contacts";
import PopupView from "../popupView";

export default class ActivitiesTable extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "activities",
					scroll: "auto",
					select: true,
					columns: [
						{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
						{id: "TypeID", header: [{content: "richSelectFilter"}], options: activityTypes, sort: "string"},
						{id: "convertedTime", header: [{content: "dateRangeFilter", inputConfig: {format: webix.i18n.longDateFormatStr}}], sort: "date", width: 150, format: webix.i18n.longDateFormatStr},
						{id: "Details", header: [{content: "multiComboFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "editActivity", header: "", width: 50, template: "<span class='mdi mdi-file-document-edit edit_entry'></span>"},
						{id: "deleteActivity", header: "", width: 50, template: "<span class='mdi mdi-trash-can delete_entry'></span>"}
					],
					onClick: {
						delete_entry: (e, id) => {
							webix.confirm({
								title: "Delete this entry",
								text: "Are you sure you want to delete this entry?"
							}).then(() => {
								activities.remove(id);
							});
							return false;
						},
						edit_entry: (e, id) => {
							let item = activities.getItem(id);
							this.window.showWindow(item, "Edit");
							return false;
						}
					}
				},
				{cols: [
					{gravity: 3},
					{
						view: "button",
						type: "icon",
						icon: "mdi mdi-plus-box",
						label: "Add activity",
						css: "webix_primary",
						click: () => {
							let id = this.getParam("id");
							this.window.showWindow(null, "Add", id, true);
						}
					}
				]}
			]
		};
	}

	init() {
		this.window = this.ui(PopupView);
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData
		]).then(() => {
			let id = this.getParam("id");

			activities.filter(obj => obj.ContactID.toString() === id.toString());

			this.$$("activities").parse(activities);
		});
	}
}
