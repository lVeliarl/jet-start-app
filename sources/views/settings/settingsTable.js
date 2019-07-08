import {JetView} from "webix-jet";
import {iconOptions} from "../../models/iconOptions";

export default class SettingsTable extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._gridData = data;
	}

	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "datatable",
					localId: "settingsTable",
					css: "table_outline",
					editable: true,
					select: true,
					height: 300,
					columns: [
						{id: "Value", header: _("Value"), fillspace: true, editor: "text"},
						{id: "Icon", header: _("Icon"), template: "<span class='mdi mdi-#Icon#'></span>", editor: "richselect", options: iconOptions, fillspace: true},
						{id: "deleteType", header: "", width: 50, template: "<span class='mdi mdi-trash-can delete_entry'></span>"}
					],
					onClick: {
						delete_entry: (e, id) => {
							webix.confirm({
								title: _("Delete this entry"),
								text: _("Are you sure you want to delete this entry?"),
								ok: _("OK"),
								cancel: _("Cancel")
							}).then(() => {
								this._gridData.remove(id);
							});
							return false;
						}
					}
				},
				{
					cols: [
						{},
						{
							view: "button",
							type: "icon",
							icon: "mdi mdi-plus-box",
							label: _("Add value"),
							width: 200,
							css: "webix_primary",
							click: () => {
								this._gridData.add({Value: "Value", Icon: "Icon"});
							}
						}
					]
				}
			]
		};
	}

	init() {
		this.$$("settingsTable").sync(this._gridData);
	}
}
