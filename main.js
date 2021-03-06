Vue.component('google-map', {
  props: [
  ],
  mounted: function () {
  },
  template: `
    <div id="mappy"></div>
  `
});

Vue.component('search', {
  data: function () {
    return {
      valueSearch: ''
    }
  },
  props: [
    'places',
    'onAdd',
    'onSearch',
    'onHideVars',
    'onRemove',
    'selectPlace',
  ],
  computed: {},
  mounted: function () {

  },
  template: `
    <div class="search">
        <div class="search-inner">
            <ul class="search-list">
              <li class="search-list__item" v-for="(place, i) in places" :key="place.id">
                  <input
                   type="text" 
                   class="searcher" 
                   v-on:input="onSearch($event.target.value, place.id, $event.target)"
                   v-on:focus="onSearch($event.target.value, place.id)"
                   v-on:blur="onHideVars(place.id)"
                   placeholder="введите название города"
                   autofocus
                   >
                  
                   <button class="btn btn_remove" v-on:click="onRemove(place.id)">-</button>
                   
                  <div class="search-list__vars" v-if="place.list && place.list.length > 0">
                    <span
                        v-for="(item, index) in place.list" :key="item.place_id"
                        v-on:click="selectPlace(item, place.id)"
                     >{{item.description}}</span>
                  </div>
              </li>
            </ul>
            <button class="btn" v-on:click="onAdd">+</button>
        </div>
    </div>
  `
});

const defaultPlaceItem = (id) => ({
  id,
  value: '',
  placeId: null,
  list: [],
  ref: null,
  position: null,
  markers: []
});

const App = {
  data: function () {
    return {
      selectedPlaces: [
        defaultPlaceItem(+new Date()),
      ],
      map: null,
    }
  },
  mounted: function () {
    const el = document.querySelector('#mappy');
    const options = {
      zoom: 5,
      center: new google.maps.LatLng(59.93, 30.32)
    };
    this.map = new google.maps.Map(el, options);
    REGISTER_CARD(this.map);
  },
  methods: {
    addMarker: function (position, placeId) {
      const marker = new google.maps.Marker({
        map: map,
        position
      });
      map.setCenter(position);
      return marker;
    },
    removeMarker: function (place) {
      if (place.marker) {
        place.marker.setMap(null);
      }
    },
    addEmptyPlace: function () {
      this.selectedPlaces.push(defaultPlaceItem(+new Date()));
    },
    clearVars: function (id) {
      setTimeout(() => {
        const placeInput = this.selectedPlaces.find(item => item.id === id);
        placeInput.list = [];
      }, 100);
    },
    selectPlace: function (place, id) {
      const placeInput = this.selectedPlaces.find(item => item.id === id);
      placeInput.placeId = place.place_id;
      if (placeInput.ref) {
        placeInput.ref.value = place.description;
        placeInput.value = place.description;
      }
      this.removeMarker(placeInput);
      GET_COORDINATES(place.place_id).then((position) => {
        placeInput.position = position;
        placeInput.marker = this.addMarker(position, place.place_id);
      })
    },
    removePlace: function (id) {
      const place = this.selectedPlaces.find((item) => item.id === id);
      this.removeMarker(place);

      if (this.selectedPlaces.length < 2) {
        if (place.ref) {
          place.ref.value = '';
        }
        return;
      }

      this.selectedPlaces = this.selectedPlaces.filter((item) => item.id !== id);
    },
    findPlaces: function (value, id, ref) {
      const placeInput = this.selectedPlaces.find(item => item.id === id);
      placeInput.ref = ref;
      if (!value) {
        return this.removeMarker(placeInput);
      }
      if (value && value.length < 3 || !value) {
        return placeInput.list = [];
      }
      FIND_PLACE(value)
        .then((places) => {
          placeInput.list = places;
        })
        .catch(r => console.warn(r))
    },
    send: function () {
      const data = this.selectedPlaces.map((place) => place.placeId);
      console.warn(data);

      //Метод отправления placeId
    }
  },
  template: `
    <div>
        <search 
            :places="selectedPlaces"
            :onAdd="addEmptyPlace"
            :onSearch="findPlaces"
            :onHideVars="clearVars"
            :selectPlace="selectPlace"
            :onRemove="removePlace"
            ></search>
        <google-map
        ></google-map>
    </div>
`,
};

new Vue({
  el: '.app',
  components: {
    'App': App,
  }
});
