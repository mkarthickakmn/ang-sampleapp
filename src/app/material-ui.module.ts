import { NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {TooltipPosition} from '@angular/material/tooltip';

const modules=[
	    BrowserAnimationsModule,
	    A11yModule,
        LayoutModule,
	    ClipboardModule,
	    DragDropModule,
	    MatAutocompleteModule,
	    MatBadgeModule,
	    MatBottomSheetModule,
	    MatButtonModule,
	    MatButtonToggleModule,
	    MatCardModule,
	    MatCheckboxModule,
	    MatStepperModule,
	    MatDatepickerModule,
	    MatDialogModule,
	    MatExpansionModule,
	    MatIconModule,
	    MatInputModule,
	    MatListModule,
	    MatMenuModule,
	    MatNativeDateModule,
	    MatRadioModule,
	    MatRippleModule,
	    MatSelectModule,
	    MatSidenavModule,
	    MatSnackBarModule,
	    MatTabsModule,
	    MatToolbarModule,
	    MatTooltipModule,
	    MatTreeModule,
	    PortalModule,
	    ScrollingModule,
	]
@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {
}