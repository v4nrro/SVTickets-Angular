import { DatePipe } from '@angular/common';
import {
    NgForm,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { minDateValidator } from '../../shared/validators/min-date.validator';
import { EventsService } from '../services/events.service';
import { Component, inject, DestroyRef, signal, input, effect, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GaAutocompleteDirective } from '../../ol-maps/ga-autocomplete.directive';
import { OlMapDirective } from '../../ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../ol-maps/ol-marker.directive';
import { SearchResult } from '../../ol-maps/interfaces/search-result';
import { MyEvent } from '../interfaces/MyEvent';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'event-form',
  imports: [
    EncodeBase64Directive,
    ValidationClassesDirective,
    ReactiveFormsModule,
    DatePipe,
    OlMapDirective,
    OlMarkerDirective,
    GaAutocompleteDirective,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent implements CanComponentDeactivate {
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #saved = false;
  #fb = inject(NonNullableFormBuilder);
  #modalService = inject(NgbModal);

  event = input.required<MyEvent>();
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  address = signal<string>('');

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address.set(result.address);
  }

  minDate = new Date().toISOString().substring(0, 10);

  eventForm = this.#fb.group({
    title: ['',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
      ],
    ],
    description: ['', [Validators.required, Validators.minLength(5)]],
    price: [0, [Validators.required, Validators.min(0.1)]],
    image: ['', [Validators.required]],
    date: ['', [Validators.required, minDateValidator(this.minDate)]],
  });
  imageBase64 = '';

constructor(){
    effect(() => {
        if(this.event()){
            this.eventForm.setValue({
                title: this.event().title,
                description: this.event().description,
                price: this.event().price,
                image: '',
                date: this.event().date.toString().substring(0,10)
              });

            this.eventForm.controls['image'].setValidators([]);

            this.imageBase64 = this.event().image;

            this.coordinates.set([this.event().lng, this.event().lat]);
            this.address.set(this.event().address);
        }
    })
}

  canDeactivate() {
    if (this.#saved || this.eventForm.pristine){
        return true
    }

    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Changes not saved';
    modalRef.componentInstance.body = 'Do you want to leave the page?';
    return modalRef.result.catch(() => false);
  }

  addEvent() {
    this.#eventsService
      .addEvent({
        ...this.eventForm.getRawValue(),
        image: this.imageBase64,
        lat: this.coordinates()[1],
        lng: this.coordinates()[0],
        address: this.address(),
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#saved = true;
        this.#router.navigate(['/events']);
      });
  }

  editEvent() {
    this.#eventsService
      .editEvent({
        ...this.eventForm.getRawValue(),
        image: this.imageBase64,
        lat: this.coordinates()[1],
        lng: this.coordinates()[0],
        address: this.address(),
      }, this.event().id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#saved = true;
        this.#router.navigate(['/events']);
      });
  }
}
