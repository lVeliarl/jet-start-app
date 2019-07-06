import {JetView} from "webix-jet";
import {activityTypes} from "../models/activityTypes";
import {statuses} from "../models/statuses";
import SettingsTable from "./settings/settingsTable";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			type: "form",
			rows: [
				{
					view: "segmented",
					label: _("Language:"),
					localId: "language",
					name: "lang",
					options: [
						{id: "en", value: _("English")},
						{id: "ru", value: _("Russian")}
					],
					click: () => {
						this.toggleLanguage();
					}
				},
				{template: _("<h3>Activity types</h3>"), borderless: true, height: 40},
				{$subview: new SettingsTable(this.app, "", activityTypes)},
				{template: _("<h3>Statuses</h3>"), borderless: true, height: 40},
				{$subview: new SettingsTable(this.app, "", statuses)},
				{}
			]
		};
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("language").getValue();
		langs.setLang(value);
	}
}
