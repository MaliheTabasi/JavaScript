import {Modal} from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress, getAddressFromCoords } from './Utility/Location';

class PlaceFinder {
    constructor(){
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn');
        this.shareBtn = document.getElementById('share-btn')

        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
        this.shareBtn.addEventListener('click', this.sharePlaceHandler.bind(this));
        addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
    }

    sharePlaceHandler() {
        const sharedLinkInputEl = document .getElementById('share-link');
        if(!navigator.clipboard) {
            sharedLinkInputEl.select();
            return;
        }
        navigator.clipboard.writeText(sharedLinkInputEl.value)
        .then(() => {
            alert('copied to clipboard')
        })
        .catch(()=> {
            sharedLinkInputEl.select();
        })
    }

    selectPlace(coordinates, address) {
        if(this.map){
            this.map.render(coordinates);
        } else{
            this.map = new Map(coordinates);
        }
        this.shareBtn.disabled = false;
        const sharedLinkInputEl = document .getElementById('share-link');
        sharedLinkInputEl.value =`${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert('location feature is not available in your browser! please use more modern browser or enter address manually!');
            return;
        }
        const modal = new Modal('loading-modal-content','loading location- please wait');
        modal.show();
        navigator.geolocation.getCurrentPosition(
            async successResult => {
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude
                };
                const address = await getAddressFromCoords(coordinates);
                modal.hide();
                this.selectPlace(coordinates);
            },
            error => {
                modal.hide();
                alert('we could not locate you. please enter an address manually!')
            }
        )
    }

    async findAddressHandler(event) {
        event.preventDefault();
        const address = event.target.querySelector('input').value;
        if(!address || address.trim().length === 0) {
            alert('invalid address');
            return;
        }
        const modal = new Modal('loading-modal-content','loading location- please wait');
        modal.show();
       try {
        const coordinates =await getCoordsFromAddress(address);
        this.selectPlace(coordinate, address);
       } catch (err) {
           alert(err.message)
       }

       modal.hide();
    }
}

new PlaceFinder();