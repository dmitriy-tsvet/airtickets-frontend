<template>
  <v-container class="py-5">
    <v-form ref="form">
      <v-row>
        <v-col cols="6">
          <v-autocomplete
            ref="from_country_input"
            v-model="from_country"
            :items="countries"
            :rules="rules"
            label="From"
            placeholder="Select..."
            variant="outlined"
            density="compact"
            :hide-details="true"

          ></v-autocomplete>
        </v-col>
        <v-col cols="6">
          <v-autocomplete
            ref="to_country_input"
            v-model="to_country"
            :items="countries"
            :rules="rules"
            label="To"
            placeholder="Select..."
            variant="outlined"
            required
            density="compact"
            :hide-details="true"

          ></v-autocomplete>
        </v-col>
        </v-row>
      </v-form>
    </v-container>

    <v-container class="pt-0">
      <v-row>
        <v-col cols="6">
          <vue-date-picker
              menu-class-name="custom-menu"
              calendar-class-name="custom-menu"
              calendar-cell-class-name="custom-menu"
              input-class-name="custom-menu"
              v-model="departure_date"
              placeholder="Departure"
              teleport-center
              auto-apply
              :dark="calendar_dark_scheme"
              :enable-time-picker="false">

          </vue-date-picker>
        </v-col>
        <v-col cols="6">
            <vue-date-picker
              menu-class-name="custom-menu"
              calendar-class-name="custom-menu"
              calendar-cell-class-name="custom-menu"
              input-class-name="custom-menu"
              v-model="back_date"
              teleport-center
              auto-apply
              placeholder="Back"
              :dark="calendar_dark_scheme"
              :enable-time-picker="false"
              required="true"
            >
            </vue-date-picker>
        </v-col>
        <v-col cols="auto" class="py-0">
          <v-checkbox-btn
              @click="hapticFeedbackSectionChanged"
              color="var(--tg-theme-button-color)"
              v-model="no_back_ticket"
              label="No back ticket needed"
          ></v-checkbox-btn>
        </v-col>
    </v-row>
  </v-container>

  <divider-component></divider-component>
  <br>
  <v-container>
    <passenger-counter-component v-for="item in passengersGroups" :key="item.index">
      <template v-slot:title>
        {{ item.title }}
      </template>

      <template v-slot:count>
        {{ item.count }}
      </template>

      <template v-slot:decrease_button>
        <v-btn
          @click="decreaseGroupPassengersCount(item.id)"
          color="var(--tg-theme-button-color)"
          variant="tonal"
          size="x-small"
          icon="mdi-minus"
          rounded="lg">
        </v-btn>
      </template>

      <template v-slot:increase_button>
        <v-btn
          @click="increaseGroupPassengersCount(item.id)"
          color="var(--tg-theme-button-color)"
          variant="tonal"
          size="x-small"
          icon="mdi-plus"
          rounded="lg">
        </v-btn>
      </template>
    </passenger-counter-component>
    <br>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="auto">
        <v-switch
            @click="hapticFeedbackSectionChanged"
            class="py-0"
            v-model="is_business_class"
            color="var(--tg-theme-button-color)"
            label="Business">
        </v-switch>
      </v-col>
    </v-row>
    <v-btn
        @click="redirectToAvailableTicketsPage()"
        size="large"
        width="100%"
        color="var(--tg-theme-button-color)"
        variant="tonal">
      CONTINUE
    </v-btn>
  </v-container>
  <divider-component></divider-component>
</template>

<script>

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import DividerComponent from "@/components/DividerComponent";
import PassengerCounterComponent from "@/components/PassengerCounterComponent";
import lscache from "lscache";

export default {
  name: "TicketFindPage",
  components: { VueDatePicker, DividerComponent, PassengerCounterComponent},
  data: () => {
    return {
         countries: ["Brazil", "China", "France", "Germany", "India", "Ireland", "Italy", "Japan",
        "Mexico", "Russia", "South Africa", "South Korea", "Turkey", "UAE", "UK", "USA",
    ],
    rules: [
      v => !!v || 'Country is required'
    ],
    calendar_dark_scheme: true,
    departure_date: null,
    back_date: null,
    no_back_ticket: false,
    from_country: null,
    to_country: null,
    is_business_class: false,
    passengersGroups: [
      {
        id: 0, title: "12 years and older", count: 1
      },
      {
        id: 1, title: "From 2 to 12 years", count: 0
      },
      {
        id: 2, title: "Up to 2 years", count: 0
      },
    ]
    }
  },
  mounted() {
    window.Telegram.WebApp.BackButton.show()
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push({ path: '/'});
    })

    if (window.Telegram.WebApp.colorScheme === "light") {
      this.calendar_dark_scheme = false
    }
    window.Telegram.WebApp.enableClosingConfirmation()
  },
  unmounted() {
    window.Telegram.WebApp.BackButton.offClick()
    window.Telegram.WebApp.BackButton.hide()
  },
  computed: {
    flightSearchFilter () {
      return this.$store.getters.getFlightSearchFilter;
    }
  },
  watch: {
    from_country:function (val) {
      if (this.countries.includes(val)) {
        this.$refs.from_country_input.blur();
      }
    },
    to_country:function (val) {
      if (this.countries.includes(val)) {
        this.$refs.to_country_input.blur();
      }
    }
  },
  methods: {
    hideKeyboard(event) {
      event.preventDefault();
      event.target.blur();
    },
    async validate_country_form () {
      const { valid } = await this.$refs.form.validate()
      return valid
    },
    redirectToAvailableTicketsPage() {
        lscache.set("flight_search_filter", {
          from_country: this.from_country,
          to_country: this.to_country,
          adult_passengers_count: this.passengersGroups[0].count,
          teenager_passengers_count: this.passengersGroups[1].count,
          child_passengers_count: this.passengersGroups[2].count,
          is_business_class: this.is_business_class,
          departure_date: this.departure_date,
          back_date: this.back_date,
          no_back_ticket: this.no_back_ticket
        }, "10")

        this.validate_country_form().then((response) => {
          if (response && this.departure_date && (this.back_date || this.no_back_ticket) ){
            this.$router.push({ path: '/searchTickets'});
          }
          else{
            window.Telegram.WebApp.showAlert(
                "Select countries and dates, please check if everything is correct."
            )
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
          }
        })


    },
    increaseGroupPassengersCount (index) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      let all_count = this.passengersGroups[0].count + this.passengersGroups[1].count + this.passengersGroups[2].count
      if (all_count < 9) {
        if ((index < 2) && (this.passengersGroups[index].count < 9)) {
          this.passengersGroups[index].count ++
        }
        else if ((index === 2) && (this.passengersGroups[0].count > this.passengersGroups[index].count)) {
            this.passengersGroups[index].count ++
        }
      }
    },
    decreaseGroupPassengersCount (index) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        if ((index > 0) && (this.passengersGroups[index].count > 0)) {
            this.passengersGroups[index].count --
        }
        else if ((index === 0) && (this.passengersGroups[index].count > 1)
            && (this.passengersGroups[2].count < this.passengersGroups[index].count)) {
            this.passengersGroups[index].count --
        }
    },
    hapticFeedbackSectionChanged() {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
  },
}
</script>

<style scoped>

</style>