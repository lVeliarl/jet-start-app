import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {activityTypes} from "../../models/activityTypes";
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
						{id: "TypeID", header: ["Activity type", {content: "richSelectFilter"}], options: activityTypes, sort: "string"},
						{id: "convertedTime", header: ["Due date", {content: "datepickerFilter"}], sort: "date", width: 150, format: webix.i18n.longDateFormatStr},
						{id: "Details", header: ["Details", {content: "multiComboFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "editActivity", header: "", width: 50, template: "<span class='mdi mdi-file-document-edit'></span>", css: "edit_entry"},
						{id: "deleteActivity", header: "", width: 50, template: "<span class='mdi mdi-trash-can'></span>", css: "delete_entry"}
					],
					onClick: {
						delete_entry: (e, id) => {
							webix.confirm({
								title: "Delete this entry",
								text: "Are you sure you want to delete this entry?"
							}).then(() => {
								activities.remove(id);
							});
						},
						edit_entry: (e, id) => {
							let item = activities.getItem(id);
							this.ui(PopupView).showWindow(item, "Edit");
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
						css: "webix_primary"
					}
				]}
			]
		};
	}
}
