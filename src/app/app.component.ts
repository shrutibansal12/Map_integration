import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gravitipage';
  latorigin: number = 52.358;
  lngorigin: number = 4.916;
  latdes: number = 52.358;
  lngdes: number = 4.916;
  public origin: any;
  public destination: any;
  @ViewChild('searchOrigin') searchOrigin!: ElementRef;
  @ViewChild('searchDestination') searchDestination!: ElementRef;
  @ViewChild('searchStop') searchStop!: ElementRef;
  public lngstop: any;
  public latstop: any;
  public distanceInkMeters:any;
  public originplace :string="";
  public desplace: string="";
  public stopplace: string[] = [];
  public waypoints = <any>[];
  
  constructor(
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.origin = { lat: 24.799448, lng: 120.979021 };
    this.destination = { lat: 24.799524, lng: 120.975017 };
  }

  findAdress(type: string) {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(type === 'origin' ? this.searchOrigin.nativeElement : this.searchDestination.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place);
    
        if (type === 'origin') {
          this.originplace=this.searchOrigin.nativeElement.value.split(',')[0];
          console.log( this.originplace);
          if (place.geometry?.location.lat())
          this.latorigin = place.geometry?.location.lat();
          if (place.geometry?.location.lng())
          this.lngorigin = place.geometry?.location.lng();
        } else {
          this.desplace=this.searchDestination.nativeElement.value.split(',')[0];
          if (place.geometry?.location.lat())
          this.latdes = place.geometry?.location.lat();
          if (place.geometry?.location.lng())
          this.lngdes = place.geometry?.location.lng();
        }
        });
      });
    });
   }


   calculate(){
    this.origin = {lat:this.latorigin,lng: this.lngorigin};
        this.destination = {lat:this.latdes,lng:this.lngdes};
        this.distanceInkMeters = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(this.origin),
          new google.maps.LatLng(this.destination)
      )* 0.001;
   }


   stops(){
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchStop.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.latstop = place.geometry?.location.lat();
          this.lngstop = place.geometry?.location.lng();
          this.waypoints.push({location: { lat: this.latstop, lng: this.lngstop }});
        });
        this.stopplace.push(this.searchStop.nativeElement.value.split(',')[0]);
      });
    });
   }
}

// {
//   "address_components": [
//       {
//           "long_name": "Mumbai - Pune Expressway",
//           "short_name": "Mumbai - Pune Expy",
//           "types": [
//               "route"
//           ]
//       },
//       {
//           "long_name": "Yamuna Kunj",
//           "short_name": "Yamuna Kunj",
//           "types": [
//               "neighborhood",
//               "political"
//           ]
//       },
//       {
//           "long_name": "Sector-10",
//           "short_name": "Sector-10",
//           "types": [
//               "sublocality_level_3",
//               "sublocality",
//               "political"
//           ]
//       },
//       {
//           "long_name": "New Panvel East",
//           "short_name": "New Panvel East",
//           "types": [
//               "sublocality_level_2",
//               "sublocality",
//               "political"
//           ]
//       },
//       {
//           "long_name": "Panvel",
//           "short_name": "Panvel",
//           "types": [
//               "sublocality_level_1",
//               "sublocality",
//               "political"
//           ]
//       },
//       {
//           "long_name": "Navi Mumbai",
//           "short_name": "Navi Mumbai",
//           "types": [
//               "locality",
//               "political"
//           ]
//       },
//       {
//           "long_name": "Thane taluka",
//           "short_name": "Thane taluka",
//           "types": [
//               "administrative_area_level_3",
//               "political"
//           ]
//       },
//       {
//           "long_name": "Maharashtra",
//           "short_name": "MH",
//           "types": [
//               "administrative_area_level_1",
//               "political"
//           ]
//       },
//       {
//           "long_name": "India",
//           "short_name": "IN",
//           "types": [
//               "country",
//               "political"
//           ]
//       }
//   ],
//   "adr_address": "<span class=\"street-address\">Mumbai - Pune Expy</span>, <span class=\"extended-address\">Yamuna Kunj, Sector-10, New Panvel East, Panvel</span>, <span class=\"locality\">Navi Mumbai</span>, <span class=\"region\">Maharashtra</span>, <span class=\"country-name\">India</span>",
//   "formatted_address": "Mumbai - Pune Expy, Yamuna Kunj, Sector-10, New Panvel East, Panvel, Navi Mumbai, Maharashtra, India",
//   "geometry": {
//       "location": {
//           "lat": 19.0012121,
//           "lng": 73.1290929
//       },
//       "viewport": {
//           "south": 18.9998631197085,
//           "west": 73.12774391970851,
//           "north": 19.0025610802915,
//           "east": 73.13044188029151
//       }
//   },
//   "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png",
//   "icon_background_color": "#7B9EB0",
//   "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
//   "name": "Mumbai - Pune Expressway",
//   "place_id": "EmRNdW1iYWkgLSBQdW5lIEV4cHksIFlhbXVuYSBLdW5qLCBTZWN0b3ItMTAsIE5ldyBQYW52ZWwgRWFzdCwgUGFudmVsLCBOYXZpIE11bWJhaSwgTWFoYXJhc2h0cmEsIEluZGlhIi4qLAoUChIJx6MHCOD_5zsRaHAmiNjVp3ISFAoSCaVLNL5b6Oc7EYtsTSq5aQDj",
//   "reference": "EmRNdW1iYWkgLSBQdW5lIEV4cHksIFlhbXVuYSBLdW5qLCBTZWN0b3ItMTAsIE5ldyBQYW52ZWwgRWFzdCwgUGFudmVsLCBOYXZpIE11bWJhaSwgTWFoYXJhc2h0cmEsIEluZGlhIi4qLAoUChIJx6MHCOD_5zsRaHAmiNjVp3ISFAoSCaVLNL5b6Oc7EYtsTSq5aQDj",
//   "types": [
//       "route"
//   ],
//   "url": "https://maps.google.com/?q=Mumbai+-+Pune+Expy,+Yamuna+Kunj,+Sector-10,+New+Panvel+East,+Panvel,+Navi+Mumbai,+Maharashtra,+India&ftid=0x3be7ffe00807a3c7:0x72a7d5d888267068",
//   "utc_offset": 330,
//   "vicinity": "Sector-10",
//   "html_attributions": [],
//   "utc_offset_minutes": 330
// }