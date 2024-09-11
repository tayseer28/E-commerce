import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OwnTranslateService } from '../../core/services/ownTranslate/own-translate.service';
import { TranslateModule } from '@ngx-translate/core';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';

@Component({
  selector: 'app-nav-auth',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './nav-auth.component.html',
  styleUrl: './nav-auth.component.scss'
})
export class NavAuthComponent {

  private readonly _OwnTranslateService = inject(OwnTranslateService,)
  private readonly  _FlowbiteService = inject(FlowbiteService)

  change(lang: string) {
    this._OwnTranslateService.changeLang(lang);
  }
  // ngOnInit(): void {
  //   this._FlowbiteService.loadFlowbite(flowbite => {
  //     console.log('Flowbite loaded', flowbite);
  //   });
  // }

}
