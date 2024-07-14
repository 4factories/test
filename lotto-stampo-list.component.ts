import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LottoStampo} from '../../../models/lotto/lotto-stampo';
import {LottoStampaRestService} from '../../../services/lotto/lotto-stampa/lotto-stampa-rest.service';
import {CommonDatatableService} from '../../../services/common/common-datatable.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Config} from "datatables.net";
import {CommonLottoService} from "../../../services/lotto/common/common-lotto.service";

@Component({
  selector: 'fff-lotto-stampo-list',
  templateUrl: './lotto-stampo-list.component.html',
  styleUrls: ['./lotto-stampo-list.component.css']
})
export class LottoStampoListComponent implements OnInit, AfterViewInit {


  public lottoStampaList: Array<LottoStampo> = [];

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;
  // @ts-ignore
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions: Config = {};

  public errorMessage: string;

  constructor(private lottoStampaRestService: LottoStampaRestService,
              private commonLottoService: CommonLottoService) {
  }

  ngOnInit() {
    this.dtOptions = this.commonLottoService.dtOptionsForList;
    this.getAllLottiStampo();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    CommonDatatableService.createIndividualColumnSearching(this.datatableElement);
  }

  private getAllLottiStampo(): void {
    const anagObs = this.lottoStampaRestService.getAll().subscribe({
      error: (err) => {
        this.errorMessage = err;
        anagObs.unsubscribe();
      },
      next: (resp) => {
        this.lottoStampaList = resp.content;
        this.datatableElement.dtInstance.then(dtInstance => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(null);
        });
        anagObs.unsubscribe();
      }
    });
  }

  public onLottoStampaRigaDelete(): void {
    const getAllRestService = this.lottoStampaRestService.deleteById(1).subscribe({
      error: (err) => {
        this.errorMessage = err;
        getAllRestService.unsubscribe();
      },
      next: () => {
        this.getAllLottiStampo();
        getAllRestService.unsubscribe();
      }
    });
  }
}
