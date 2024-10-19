import { MatPaginatorIntl } from '@angular/material/paginator';

export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Items por página:';
  override nextPageLabel = 'Siguiente página';
  override previousPageLabel = 'Página anterior';
}
