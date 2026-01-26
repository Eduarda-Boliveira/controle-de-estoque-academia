import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';

export interface ReportData {
  sales: Array<{
    date: string;
    productName: string;
    value: string;
    paymentMethod: string;
  }>;
  totals: {
    general: number;
    dinheiro: number;
    debito: number;
    credito: number;
    pix: number;
  };
}

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Configuração do Ethereal
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });
  }

  async sendReportEmail(reportData: ReportData, recipientEmail: string): Promise<void> {
    try {
      // Gerar PDF
      const pdfBuffer = this.generatePDFBuffer(reportData);
      
      // Data atual
      const today = new Date();
      const dateStr = today.toLocaleDateString('pt-BR');
      const timeStr = today.toLocaleTimeString('pt-BR');
      
      // Configurar email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: ` Relatório de Vendas - ${dateStr}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(90deg, #333, #666); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0;"> Relatório de Vendas</h1>
              <p style="margin: 5px 0 0 0;">Gerado em ${dateStr} às ${timeStr}</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
              <h2 style="color: #333; margin-top: 0;"> Resumo Rápido</h2>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #4caf50;">
                  <h3 style="margin: 0 0 5px 0; color: #333;">Total de Vendas</h3>
                  <p style="margin: 0; font-size: 24px; font-weight: bold; color: #4caf50;">${reportData.sales.length}</p>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #ff9800;">
                  <h3 style="margin: 0 0 5px 0; color: #333;">Faturamento Total</h3>
                  <p style="margin: 0; font-size: 24px; font-weight: bold; color: #ff9800;">R$ ${reportData.totals.general.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
              
              <h3 style="color: #333;"> Por Forma de Pagamento:</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 8px 0;"> <strong>Dinheiro:</strong> R$ ${reportData.totals.dinheiro.toFixed(2).replace('.', ',')}</li>
                <li style="margin: 8px 0;"> <strong>Débito:</strong> R$ ${reportData.totals.debito.toFixed(2).replace('.', ',')}</li>
                <li style="margin: 8px 0;"> <strong>Crédito:</strong> R$ ${reportData.totals.credito.toFixed(2).replace('.', ',')}</li>
                <li style="margin: 8px 0;"> <strong>PIX:</strong> R$ ${reportData.totals.pix.toFixed(2).replace('.', ',')}</li>
              </ul>
              
              <p style="margin-top: 25px; padding: 15px; background: #e8f5e8; border-radius: 6px; border-left: 4px solid #4caf50;">
                <strong>O relatório completo está em anexo!</strong><br>
                Verifique o arquivo PDF para ver todos os detalhes das vendas.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 15px; background: #333; color: white; border-radius: 8px;">
              <p style="margin: 0;"> Sistema de Controle de Estoque</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Relatório gerado automaticamente</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `relatorio-vendas-${today.toISOString().split('T')[0]}.pdf`,
            content: pdfBuffer,
          },
        ],
      };

      // Enviar email
      await this.transporter.sendMail(mailOptions);
      console.log(` Relatório enviado para: ${recipientEmail}`);
    } catch (error) {
      console.error(' Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email com o relatório');
    }
  }

  private generatePDFBuffer(reportData: ReportData): Buffer {
    const doc = new jsPDF();
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR');
    const timeStr = today.toLocaleTimeString('pt-BR');
    
    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('RELATÓRIO DE VENDAS', 20, 30);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Data: ${dateStr} - ${timeStr}`, 20, 45);
    
    // Linha separadora
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);
    
    // Resumo Geral
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('RESUMO GERAL', 20, 70);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Total de Vendas: ${reportData.sales.length}`, 20, 85);
    doc.text(`Faturamento Total: R$ ${reportData.totals.general.toFixed(2).replace('.', ',')}`, 20, 95);
    
    // Detalhamento por forma de pagamento
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('DETALHAMENTO POR FORMA DE PAGAMENTO', 20, 115);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let yPosition = 130;
    
    doc.text(`Dinheiro: R$ ${reportData.totals.dinheiro.toFixed(2).replace('.', ',')}`, 30, yPosition);
    doc.text(`Débito: R$ ${reportData.totals.debito.toFixed(2).replace('.', ',')}`, 30, yPosition + 10);
    doc.text(`Crédito: R$ ${reportData.totals.credito.toFixed(2).replace('.', ',')}`, 30, yPosition + 20);
    doc.text(`PIX: R$ ${reportData.totals.pix.toFixed(2).replace('.', ',')}`, 30, yPosition + 30);
    
    yPosition += 50;
    
    // Vendas Detalhadas
    if (reportData.sales.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('VENDAS DETALHADAS', 20, yPosition);
      
      yPosition += 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      reportData.sales.forEach((sale, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.text(`${index + 1}. ${sale.date} - ${sale.productName}`, 25, yPosition);
        doc.text(`   Valor: ${sale.value} | Pagamento: ${sale.paymentMethod}`, 25, yPosition + 8);
        yPosition += 20;
      });
    }
    
    // Rodapé
    const pageCount = (doc as any).internal.pages.length - 1; // -1 porque a primeira página é vazia
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Sistema de Controle de Estoque - Página ${i} de ${pageCount}`, 20, 285);
    }
    
    return Buffer.from(doc.output('arraybuffer'));
  }
}