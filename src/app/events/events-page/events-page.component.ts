import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../interfaces/MyEvent';

@Component({
  selector: 'events-page',
  imports: [FormsModule, EventCardComponent],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent {
  title = 'Events Page';

  #eventsService = inject(EventsService);

  events = signal<MyEvent[]>([]);

  constructor() {
    this.#eventsService
      .getEvents()
      .pipe(takeUntilDestroyed())
      .subscribe((myEvents) => this.events.set(myEvents));
  }

  addEvent(event: MyEvent) {
    this.events.update((events) => [...events, event]);
  }

  deleteEvent(event: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== event));
  }

  search = signal('');
  filteredEvents = computed(() => {
    const searchLower = this.search()?.toLocaleLowerCase();
    return searchLower
      ? this.events().filter((event) =>
          event.title.toLocaleLowerCase().includes(searchLower)
        )
      : this.events();
  });

  orderByPrice() {
    this.events.update((events) =>
      events.toSorted((a, b) => a.price - b.price)
    );
  }

  orderByDate() {
    this.events.update((events) =>
      events.toSorted((a, b) => a.date.localeCompare(b.date))
    );
  }
}
