import { DatePipe } from '@angular/common';
import {
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
import { Component, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { GaAutocompleteDirective } from '../../ol-maps/ga-autocomplete.directive';
// import { OlMapDirective } from '../../ol-maps/ol-map.directive';
// import { OlMarkerDirective } from '../../ol-maps/ol-marker.directive';
import { SearchResult } from '../../ol-maps/search-result';

@Component({
  selector: 'event-form',
  imports: [
    EncodeBase64Directive,
    ValidationClassesDirective,
    ReactiveFormsModule,
    DatePipe,
    // OlMapDirective,
    // OlMarkerDirective,
    // GaAutocompleteDirective,
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

  coordinates = signal<[number, number]>([-0.5, 38.5]);

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    console.log(result.address); // Habría que guardarlo
  }

  minDate = new Date().toISOString().substring(0, 10);

  eventForm = this.#fb.group({
    title: [
      '',
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

  canDeactivate() {
    return (
      this.#saved ||
      this.eventForm.pristine ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }

  addEvent() {
    this.#eventsService
      .addEvent({
        ...this.eventForm.getRawValue(),
        image: this.imageBase64,
        lat: 1,
        lng: 2,
        address: 'string',
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#saved = true;
        this.#router.navigate(['/events']);
      });
  }
}
