<template>
  <v-card width="600px" class="mx-auto mt-5">
    <v-card-title>
      <h2 class="text-center">New Equipo</h2>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="id"
          prepend-icon="mdi-qrcode"
          label="備品コード"
          required
          maxlength="6"
          :rules="[rules.required]"
          :error-messages="idError"
        ></v-text-field>
        <v-combobox
          v-model="tags"
          :items="tagChoices"
          prepend-icon="mdi-tag"
          label="タグ"
          multiple
          chips
          required
          clearable
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click:close="removeTag(item)"
            >
              <strong>{{ item }}</strong>
            </v-chip>
          </template>
        </v-combobox>
        <v-text-field
          v-model="model"
          prepend-icon="mdi-numeric"
          label="型番"
          required
        ></v-text-field>
        <v-text-field
          v-model="name"
          prepend-icon="mdi-form-textbox"
          label="品名"
          required
        ></v-text-field>
        <v-text-field
          v-model="manufacture"
          prepend-icon="mdi-domain"
          label="メーカー"
          required
        ></v-text-field>
        <v-autocomplete
          v-model="location"
          prepend-icon="mdi-map-marker"
          label="保管場所"
          required
          :items="locationChoices"
          item-text="text"
          item-value="ref"
        ></v-autocomplete>
        <v-textarea
          v-model="notes"
          prepend-icon="mdi-note-text"
          label="備考"
          required
          @keyup.enter="login()"
          rows="1"
        ></v-textarea>

        <v-card-actions>
          <v-btn class="mr-4" @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import { Config, Equipo, Location } from "@/models";

export default Vue.extend({
  name: "Manage",
  data: function () {
    return {
      id: "",
      tags: [] as string[],
      model: "",
      name: "",
      manufacture: "",
      location: null as firebase.firestore.DocumentReference | null,
      notes: "",
      tagChoices: [] as string[],
      locationChoices: [] as Location[],
      db: firebase.firestore(),
      configDoc: firebase.firestore().collection("config").doc("config"),
      equiposCol: firebase.firestore().collection("equipos"),
      idError: "",
      rules: {
        required: (value: string) => !!value || "この項目は必須です",
      },
    };
  },
  async mounted() {
    const config = (await this.configDoc.get()).data() as Config;
    this.tagChoices = config.tags;

    const equiposSnapshot = await this.equiposCol.get();
    this.locationChoices = equiposSnapshot.docs.map((doc) => {
      const equipo = doc.data() as Equipo;
      return {
        ref: doc.ref,
        text: `${equipo.id}: ${equipo.name}`,
      } as Location;
    });
  },
  methods: {
    async submit() {
      const config = (await this.configDoc.get()).data() as Config;
      const tags = [...config.tags, ...this.tags];
      this.configDoc.set({ tags: [...new Set(tags)] });

      // validate

      const e = new Equipo({
        id: this.id,
        tags: this.tags,
        model: this.model,
        name: this.name,
        manufacture: this.manufacture,
        location: this.location,
        notes: this.notes,
        isTakingOut: true,
        isRemoved: false,
      });

      this.equiposCol.doc(this.id).set(e.toObject());
      this.$router.push("/manage");
    },
    removeTag(tag: string) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
  },
  components: {},
  watch: {
    async id(id) {
      this.id = id.toUpperCase();

      if (!id.match(/^[A-Z]-\d{4}$/)) {
        this.idError = "IDが正しい形式ではありません";
        return;
      }
      if ((await this.equiposCol.doc(id).get()).exists) {
        this.idError = "このIDは既に登録されています";
        return;
      }

      this.idError = "";
    },
  },
});
</script>
